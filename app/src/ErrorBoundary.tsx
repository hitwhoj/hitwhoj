import { Button, Result } from "@arco-design/web-react";
import { useNavigate } from "@remix-run/react";

export function ErrorBoundary({ error }: { error: Error }) {
  const navigate = useNavigate();

  return (
    <Result
      status="error"
      title="出错啦"
      subTitle={`错误: ${error.message}`}
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          重试
        </Button>
      }
    />
  );
}
