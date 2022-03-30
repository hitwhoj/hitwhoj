import { Button, Result } from "@arco-design/web-react";

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Result
      status="error"
      title="出错啦"
      subTitle={`错误: ${error.message}`}
      extra={<Button type="primary">重试</Button>}
    />
  );
}
