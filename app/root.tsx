import { useEffect, useState } from "react";
import style from "./styles/global.css";
import arcoStyle from "@arco-design/web-react/dist/css/arco.css";
import katexStyle from "katex/dist/katex.css";
import {
  json,
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "remix";
import Layout from "./src/Layout";
import { db } from "~/utils/db.server";
import { findSessionUid } from "~/utils/sessions";
import { CatchBoundary as CustomCatchBoundary } from "~/src/CatchBoundary";
import { ErrorBoundary as CustomErrorBoundary } from "~/src/ErrorBoundary";
import { getCookie } from "./utils/cookies";
import { Theme, ThemeContext } from "./utils/context/theme";
import { UserInfo, UserInfoContext } from "./utils/context/user";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: katexStyle,
  },
  {
    rel: "stylesheet",
    href: arcoStyle,
  },
  {
    rel: "stylesheet",
    href: style,
  },
];

type LoaderData = {
  theme: Theme;
  user: UserInfo;
};

export const loader: LoaderFunction = async ({ request }) => {
  const theme = getCookie(request, "theme") === "dark" ? "dark" : "light";
  const uid = await findSessionUid(request);

  if (!uid) {
    return json({ theme, user: null });
  }

  const user = await db.user.findUnique({
    where: { uid },
    select: {
      uid: true,
      username: true,
      nickname: true,
      avatar: true,
    },
  });

  return json({ theme, user });
};

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
  theme?: Theme;
}

const Document = ({ children, title, theme }: DocumentProps) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body arco-theme={theme ?? "light"}>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { user, theme: defaultTheme } = useLoaderData<LoaderData>();
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    document.cookie = `theme=${theme}; path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  }, [theme]);

  return (
    <Document theme={theme}>
      <UserInfoContext.Provider value={user}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <Layout>
            <Outlet />
          </Layout>
        </ThemeContext.Provider>
      </UserInfoContext.Provider>
    </Document>
  );
}

// FIXME: ErrorBoundary 和 CatchBoundary 好像没法同步主题
// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title={`错误: ${error.message} - HITwh OJ`}>
      <CustomErrorBoundary error={error} />
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`错误: ${caught.status} ${caught.statusText} - HITwh OJ`}>
      <CustomCatchBoundary />
    </Document>
  );
}
