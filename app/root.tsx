import * as React from "react";
import style from "./styles/global.css";
import arcoStyle from "@arco-design/web-react/dist/css/arco.css";
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
import { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { findSessionUid } from "~/utils/sessions";
import { CatchBoundary as CustomCatchBoundary } from "~/src/CatchBoundary";
import { ErrorBoundary as CustomErrorBoundary } from "~/src/ErrorBoundary";

export const links: LinksFunction = () => [
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
  user: Pick<User, "nickname" | "avatar"> | null;
  uid: number | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const uid = await findSessionUid(request);
  if (!uid) {
    return json({
      user: null,
      uid: null,
    });
  }
  const user = await db.user.findUnique({
    where: { uid },
    select: { nickname: true, avatar: true },
  });
  return json({
    user,
    uid,
  });
};

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = ({ children, title }: DocumentProps) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
};

export const UserInfoContext = React.createContext<LoaderData>({
  user: null,
  uid: null,
});

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { user, uid } = useLoaderData<LoaderData>();

  return (
    <Document>
      <UserInfoContext.Provider value={{ user, uid }}>
        <Layout>
          <Outlet />
        </Layout>
      </UserInfoContext.Provider>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title={`错误: ${error.message} - HITwh OJ`}>
      <Layout>
        <CustomErrorBoundary error={error} />
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`错误: ${caught.status} ${caught.statusText} - HITwh OJ`}>
      <Layout>
        <CustomCatchBoundary />
      </Layout>
    </Document>
  );
}
