import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Markdown } from "~/src/Markdown";
import { constants, fs } from "~/utils/fs";
import { resolve } from "path";

export async function loader({ params }: LoaderArgs) {
  const path = params["*"];
  if (!path) {
    throw redirect(`/docs/index.md`);
  } else if (!path.endsWith(".md")) {
    throw redirect(`/docs/${path}.md`);
  }
  const filepath = resolve("docs", path);

  // check if `path` is readable
  try {
    await fs.access(filepath, constants.R_OK);
  } catch (e) {
    throw new Response("页面不存在", { status: 404 });
  }

  // try to read the file
  try {
    const markdown = (await fs.readFile(filepath, "utf8")).trim();
    const _title = markdown.startsWith("# ")
      ? (markdown.indexOf("\n") > -1
          ? markdown.slice(0, markdown.indexOf("\n"))
          : markdown
        ).slice(2)
      : "";
    const title = _title ? `帮助: ${_title} - HITwhOJ` : "帮助 - HITwh OJ";

    return json({ markdown, title });
  } catch (e) {
    throw new Response("读取文件失败", { status: 500 });
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: data?.title,
});

export default function DocsPage() {
  const { markdown } = useLoaderData<typeof loader>();

  return <Markdown>{markdown}</Markdown>;
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
