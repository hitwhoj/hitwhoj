import { useNavigate } from "@remix-run/react";

type ErrorBoundaryProps = {
  error: Error;
};

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  const navigate = useNavigate();

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="not-prose card card-compact bg-error text-error-content w-96 shadow-lg">
        <figure>
          <img src="/error.png" alt="error" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">网站貌似出现了一些异常</h2>
          <p>{error.message}</p>
          <p>您可以尝试向管理员反馈此问题</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              返回上一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
