import * as React from "react";
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
import { withEmotionCache } from "@emotion/react";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material";
import theme from "./src/theme";
import ClientStyleContext from "./src/ClientStyleContext";
import Layout from "./src/Layout";
import { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { findSessionUid } from "~/utils/sessions";

import style from "./styles/global.css";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: style,
  },
];

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = React.useContext(ClientStyleContext);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
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
  }
);

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

export const UserInfoContext = React.createContext<LoaderData>({
  user: null,
  uid: null,
});

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { user, uid } = useLoaderData<LoaderData>();
  console.log(user, uid);
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
