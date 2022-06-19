import React, { useEffect, useRef, useState } from "react";
import {
  Affix,
  Alert,
  Button,
  Form,
  Input,
  Layout,
  Modal,
} from "@arco-design/web-react";
import { NavbarTabs } from "./components/NavbarMenu";
import NavbarTop from "./components/NavbarTop";
import { IconCopyright } from "@arco-design/web-react/icon";
import { useFetcher } from "@remix-run/react";
import { LoginModalContext } from "~/utils/context/modal";
import type { LoginActionData } from "~/routes/login";
import { version } from "../../../package.json";

const Sider = Layout.Sider;
const Header = Layout.Header;
const Content = Layout.Content;
const Footer = Layout.Footer;

type LayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: LayoutProps) {
  const [visible, setVisible] = useState(false);
  const fetcher = useFetcher<LoginActionData>();
  const submitRef = useRef<HTMLButtonElement>(null);
  const isFetching = fetcher.state !== "idle";

  useEffect(() => {
    if (!isFetching && fetcher.data) {
      if (fetcher.data.success) {
        setVisible(false);
      }
    }
  }, [isFetching]);

  return (
    <LoginModalContext.Provider value={setVisible}>
      <Layout
        style={{ minHeight: "100vh", gap: 20 }}
        className="header-context-footer-layout"
      >
        <Header>
          <NavbarTop />
        </Header>

        <Layout
          style={{ flexDirection: "row" }}
          className="py-20% sider-context-layout"
        >
          <Sider style={{ boxShadow: "none", width: undefined }}>
            <Affix offsetTop={40}>
              <NavbarTabs />
            </Affix>
          </Sider>

          <Content>{children}</Content>
        </Layout>

        <Footer style={{ padding: "10px 0", textAlign: "center" }}>
          <div style={{ color: "var(--color-text-3)" }}>
            Copyright <IconCopyright /> 2022 HITwh OJ Dev Team{" "}
            <span style={{ color: "transparent" }}>{version}</span>
          </div>
        </Footer>
      </Layout>

      <Modal
        title="登录"
        visible={visible}
        style={{ width: 400 }}
        footer={
          <>
            <Button type="default" onClick={() => setVisible(false)}>
              注册
            </Button>
            <Button
              type="primary"
              onClick={() => submitRef.current?.click()}
              loading={isFetching}
            >
              登录
            </Button>
          </>
        }
        onCancel={() => setVisible(false)}
      >
        <fetcher.Form method="post" action="/login">
          <Form.Item label="用户名" required>
            <Input type="text" name="username" required disabled={isFetching} />
          </Form.Item>
          <Form.Item label="密码" required>
            <Input.Password name="password" required disabled={isFetching} />
          </Form.Item>
          {fetcher.data?.success === false && (
            <Alert type="error" content={fetcher.data.reason} />
          )}
          <button type="submit" style={{ display: "none" }} ref={submitRef} />
        </fetcher.Form>
      </Modal>
    </LoginModalContext.Provider>
  );
}
