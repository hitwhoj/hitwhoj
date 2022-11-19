import { WASI } from "@wasmer/wasi";
import browserBindings from "@wasmer/wasi/lib/bindings/browser";
import { WasmFs } from "@wasmer/wasmfs";
import { lowerI64Imports } from "@wasmer/wasm-transformer";

// @ts-ignore
import untar from "js-untar";
import toml from "toml";

const wasmfs = new WasmFs();
wasmfs.fs.mkdirSync("/sandbox");

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
const INSTALLED_PACKAGES: string[] = [];
const commands = new Map<
  string,
  { module: WebAssembly.Module; preopens: WapmConfig["fs"] }
>();

async function installWapmPackage(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  const files = await untar(buffer);

  wasmfs.fs.mkdirpSync(url);
  for (const file of files) {
    const filepath = `${url}/${file.name}`;
    console.log(`inflating ${filepath}`);
    if (file.type === "5") {
      wasmfs.fs.mkdirpSync(filepath);
    } else if (file.type === "0") {
      wasmfs.fs.writeFileSync(filepath, new Uint8Array(file.buffer));
    } else {
      throw new Error("unexpected file");
    }
  }

  const config = wasmfs.fs.readFileSync(`${url}/wapm.toml`) as Uint8Array;
  const decoder = new TextDecoder().decode(config.buffer);
  const cfg = toml.parse(decoder) as WapmConfig;

  const modules = new Map<string, WebAssembly.Module>();
  for (const { name, source } of cfg.module) {
    const filepath = `${url}/${source}`;
    console.log(`compiling ${filepath}`);
    const wasm = wasmfs.fs.readFileSync(filepath) as Uint8Array;
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

async function runModule(
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
      "/": "/",
      ...preopens,
    },
  });
  console.log({
    ".": "/sandbox",
    "/": "/",
    ...preopens,
  });

  const instance = await WebAssembly.instantiate(module, {
    ...wasi.getImports(module),
  });

  wasmfs.fs.writeFileSync("/dev/stdin", stdin);
  console.log(`running ${args.join(" ")}`);

  try {
    wasi.start(instance);
  } catch (e) {
    console.error(e);
  }

  console.log(wasmfs.fs.readFileSync("/dev/stdout", "utf8"));
  console.log(wasmfs.fs.readFileSync("/dev/stderr", "utf8"));
}

async function runCommand(command: string, stdin: string = "") {
  const args = command.split(" ");
  const { module, preopens } = commands.get(args[0])!;
  await runModule(module, preopens, args, stdin);
}

async function runCCode(code: string, _input: string) {
  if (!INSTALLED_PACKAGES.includes("clang")) {
    INSTALLED_PACKAGES.push("clang");
    await installWapmPackage(CLANG_PACKAGE_URL);
  }

  await runCommand(
    "clang -cc1 -triple wasm32-unkown-wasi -isysroot /sys -internal-isystem /sys/include -emit-obj -o ./main.o -",
    code
  );
  throw new Error("TODO");
}

async function runCppCode(code: string, _input: string) {
  if (!INSTALLED_PACKAGES.includes("runno")) {
    INSTALLED_PACKAGES.push("runno");
    await installWapmPackage(RUNNO_PACKAGE_URL);
  }

  await runCommand(
    "runno-clang -cc1 -Werror -emit-obj -disable-free -isysroot /sys -internal-isystem /sys/include/c++/v1 -internal-isystem /sys/include -internal-isystem /sys/lib/clang/8.0.1/include -ferror-limit 4 -fmessage-length 80 -O2 -o ./program.o -x c++ -v -",
    code
  );
  throw new Error("TODO");
}

async function runPythonCode(_code: string, _input: string) {
  throw new Error("TODO");
}
