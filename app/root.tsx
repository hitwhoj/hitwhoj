import * as React from "react";
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
import { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { findSessionUid } from "~/utils/sessions";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: katexStyle,
  },
  {
    rel: "stylesheet",
    href: style,
  },
  {
    rel: "stylesheet",
    href: arcoStyle,
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
  console.error(error);

  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}
