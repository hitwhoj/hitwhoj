import { Button, Result, Space } from "@arco-design/web-react";
import type { ThrownResponse } from "@remix-run/react";
import { Link, useCatch, useLocation, useNavigate } from "@remix-run/react";

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, string>>();
  const navigate = useNavigate();
  const location = useLocation();

  const login = (
    <Link to={`/login?redirect=${location.pathname}`}>
      <Button type="outline">登录</Button>
    </Link>
  );

  const goback = (
    <Button type="primary" onClick={() => navigate(-1)}>
      返回
    </Button>
  );

  const diana = (
    <a
      target="_blank"
      rel="noreferrer"
      href="https://www.bilibili.com/s/video/BV1FX4y1g7u8?t=42.3"
    >
      <Button type="outline">关注嘉然（不推荐）</Button>
    </a>
  );

  switch (caught.status) {
    case 400:
      return (
        <Result
          status="error"
          title="请求参数错误"
          subTitle={caught.data}
          extra={<Space children={[goback]} />}
        />
      );
    case 401:
      return (
        <Result
          status="error"
          title="请先登录"
          subTitle={caught.data || "该页面不对访客开放"}
          extra={<Space children={[goback, login]} />}
        />
      );
    case 403:
      return (
        <Result
          status="403"
          title="权限不足"
          subTitle={caught.data || "您没有访问该页面的权限"}
          extra={<Space children={[goback]} />}
        />
      );
    case 404:
      return (
        <Result
          status="404"
          title="未找到"
          subTitle={caught.data || "您访问的页面不存在"}
          extra={<Space children={[goback, diana]} />}
        />
      );
    default:
      return (
        <Result
          status="error"
          title="你打开了新世界的大门"
          subTitle={caught.data || "我们甚至不知道发生了什么"}
          extra={<Space children={[goback]} />}
        />
      );
  }
}
