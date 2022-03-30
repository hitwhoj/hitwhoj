import React from "react";
import { Layout, Divider } from "@arco-design/web-react";
import NavbarLeft from "./components/NavbarLeft";
import NavbarTop from "./components/NavbarTop";

const Sider = Layout.Sider;
const Header = Layout.Header;
const Content = Layout.Content;
const Footer = Layout.Footer;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider breakpoint="lg" width="12rem" collapsible>
        <NavbarLeft />
      </Sider>
      <Layout>
        <Header>
          <NavbarTop />
        </Header>
        <Divider
          style={{
            margin: "0",
            // borderColor: "var(--color-text-4)",
          }}
        />
        <Layout
          style={{
            backgroundColor: "var(--color-bg-3)",
            padding: "0 5%",
          }}
        >
          <Content
            style={{
              backgroundColor: "var(--color-bg-4)",
              marginTop: "1rem",
            }}
          >
            {children}
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}
