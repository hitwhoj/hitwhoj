import { WASI } from "@wasmer/wasi";
import browserBindings from "@wasmer/wasi/lib/bindings/browser";
import { WasmFs } from "@wasmer/wasmfs";
import { lowerI64Imports } from "@wasmer/wasm-transformer";

// @ts-ignore
import untar from "js-untar";
import toml from "toml";

export async function runCode(code: string, input: string, language: string) {
  console.log(code, input, language);

  switch (language) {
    case "c":
      return await runCCode(code, input);
    case "cpp":
      return await runCppCode(code, input);
    case "python":
      return await runPythonCode(code, input);
    default:
      throw new Error("Language not supported");
  }
}
interface WapmConfig {
  command: { name: string; module: string }[];
  fs: Record<string, string>;
  module: {
    abi: "wasi";
    interfaces: any;
    name: string;
    source: string;
  }[];
  packages: {
    description: string;
    name: string;
    readme: string;
    repository: string;
    version: string;
  };
}

const CLANG_PACKAGE_URL = "/wapm/clang-0.1.0.tar";
const RUNNO_PACKAGE_URL = "/wapm/runno-clang-0.1.2.tar";

const preloaded = new Array<string>();
const preloadfs = new WasmFs();

type Preopens = WapmConfig["fs"];
type Command = {
  module: WebAssembly.Module;
  preopens: Preopens;
};
const commands = new Map<string, Command>();
const cachePackage = new Map<string, ArrayBuffer>();

function memcpy(src: ArrayBuffer) {
  const dst = new ArrayBuffer(src.byteLength);
  new Uint8Array(dst).set(new Uint8Array(src));
  return dst;
}

async function fetchPackage(url: string) {
  if (cachePackage.has(url)) {
    const buffer = cachePackage.get(url)!;
    return memcpy(buffer);
  }

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  cachePackage.set(url, buffer);
  return memcpy(buffer);
}

async function extractContents(wasmfs: WasmFs, url: string) {
  const buffer = await fetchPackage(url);

  // untar into fs
  wasmfs.volume.mkdirpSync(url);
  const files = await untar(buffer);
  for (const file of files) {
    const filepath = `${url}/${file.name}`;
    // console.log(`inflate: ${filepath}`);
    if (file.type === "5") {
      wasmfs.volume.mkdirpSync(filepath);
    } else if (file.type === "0") {
      wasmfs.volume.writeFileSync(filepath, new Uint8Array(file.buffer));
    } else {
      throw new Error("unexpected file");
    }
  }
}

async function preloadPackage(wasmfs: WasmFs, url: string) {
  const config = wasmfs.volume.readFileSync(`${url}/wapm.toml`) as Uint8Array;
  const decoder = new TextDecoder().decode(config.buffer);
  const cfg = toml.parse(decoder) as WapmConfig;

  const modules = new Map<string, WebAssembly.Module>();
  for (const { name, source } of cfg.module) {
    const filepath = `${url}/${source}`;
    // console.log(`compile: ${filepath}`);
    const wasm = wasmfs.volume.readFileSync(filepath) as Uint8Array;
    const module = await WebAssembly.compile(await lowerI64Imports(wasm));
    modules.set(name, module);
  }

  const preopens: WapmConfig["fs"] = {};
  for (const [name, path] of Object.entries(cfg.fs)) {
    preopens[name] = `${url}/${path}`;
  }

  for (const { name, module } of cfg.command) {
    commands.set(name, { module: modules.get(module)!, preopens });
  }
}

async function preload(url: string) {
  if (!preloaded.includes(url)) {
    preloaded.push(url);
    await extractContents(preloadfs, url);
    await preloadPackage(preloadfs, url);
  }
}

async function runModule(
  wasmfs: WasmFs,
  module: WebAssembly.Module,
  preopens: Record<string, string>,
  args: string[],
  stdin: string
) {
  const wasi = new WASI({
    args,
    env: {},
    bindings: {
      ...browserBindings,
      fs: wasmfs.fs,
    },
    preopens: {
      ".": "/sandbox",
      ...preopens,
    },
  });

  const instance = await WebAssembly.instantiate(module, {
    ...wasi.getImports(module),
  });

  wasmfs.fs.writeFileSync("/dev/stdin", stdin);
  console.log(`running ${args.join(" ")}`);

  let exit = 0;
  try {
    wasi.start(instance);
  } catch (e) {
    const message = (e as any).message as string;
    if (message.startsWith("WASI Exit error: ")) {
      exit = (e as any).code;
    } else {
      console.error(e);
      exit = 114514;
    }
  }

  const stdout = wasmfs.fs.readFileSync("/dev/stdout", "utf8") as string;
  const stderr = wasmfs.fs.readFileSync("/dev/stderr", "utf8") as string;

  // clear stdout
  wasmfs.fs.writeFileSync("/dev/stdout", "");
  wasmfs.fs.writeFileSync("/dev/stderr", "");

  console.log(exit, stdout, stderr);

  return { exit, stdout, stderr };
}

async function runCommand(wasmfs: WasmFs, command: string, stdin: string = "") {
  const args = command.split(" ");
  const { module, preopens } = commands.get(args[0])!;
  return await runModule(wasmfs, module, preopens, args, stdin);
}

async function runCCode(code: string, _input: string) {
  await preload(CLANG_PACKAGE_URL);

  const wasmfs = new WasmFs();
  await extractContents(wasmfs, CLANG_PACKAGE_URL);
  wasmfs.volume.mkdirpSync("/sandbox");
  wasmfs.volume.writeFileSync("/sandbox/main.c", code);

  await runCommand(
    wasmfs,
    "clang -cc1 -triple wasm32-unkown-wasi -isysroot /sys -internal-isystem /sys/include -emit-obj -o ./main.o ./main.c"
  );

  return "unimplemented";
}

async function runCppCode(code: string, stdin: string) {
  await preload(RUNNO_PACKAGE_URL);

  const wasmfs = new WasmFs();
  await extractContents(wasmfs, RUNNO_PACKAGE_URL);
  wasmfs.volume.mkdirSync("/sandbox");
  wasmfs.volume.writeFileSync("/sandbox/program.cpp", code);

  for (const command of [
    "runno-clang -cc1 -Werror -emit-obj -disable-free -isysroot /sys -internal-isystem /sys/include/c++/v1 -internal-isystem /sys/include -internal-isystem /sys/lib/clang/8.0.1/include -ferror-limit 4 -fmessage-length 80 -O2 -o ./program.o -x c++ ./program.cpp -v",
    "runno-wasm-ld --no-threads --export-dynamic -z stack-size=1048576 -L/sys/lib/wasm32-wasi /sys/lib/wasm32-wasi/crt1.o ./program.o -lc -lc++ -lc++abi -o ./program.wasm",
  ]) {
    const { exit, stderr } = await runCommand(wasmfs, command);
    if (exit !== 0) {
      return stderr || `Program exited with code ${exit}`;
    }
  }

  const wasm = wasmfs.volume.readFileSync(
    "/sandbox/program.wasm"
  ) as Uint8Array;
  const module = await WebAssembly.compile(await lowerI64Imports(wasm));

  const program = await runModule(
    wasmfs,
    module,
    {},
    ["/sandbox/program.wasm"],
    stdin
  );

  if (program.exit)
    return `${program.stdout}\nprogram exited with code ${program.exit}`.trim();
  else return program.stdout;
}

async function runPythonCode(_code: string, _input: string) {
  return "unimplemented";
}
