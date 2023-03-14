import type { ThrownResponse } from "@remix-run/react";
import { Link, useCatch } from "@remix-run/react";
import { HiOutlineXCircle } from "react-icons/hi";

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, string>>();

  switch (caught.status) {
    // 一般是用户提交的表单数据有问题
    case 400:
      return (
        <div className="not-prose alert alert-error mt-4">
          <div>
            <HiOutlineXCircle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">错误</h3>
              <div className="text-xs">{caught.data}</div>
            </div>
          </div>
        </div>
      );
    case 401:
      return (
        <div className="not-prose alert alert-error mt-4">
          <div>
            <HiOutlineXCircle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">未登录</h3>
              <div className="text-xs">请登录后再进行尝试</div>
            </div>
          </div>
          <Link className="btn btn-outline" to="/login">
            登录
          </Link>
        </div>
      );
    case 403:
      return (
        <div className="not-prose alert alert-error mt-4">
          <div>
            <HiOutlineXCircle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">权限不足</h3>
              <div className="text-xs">{caught.data}</div>
            </div>
          </div>
        </div>
      );
    case 404:
      return (
        <div className="not-prose alert alert-error mt-4">
          <div>
            <HiOutlineXCircle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">未找到</h3>
              <div className="text-xs">{caught.data}</div>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="not-prose alert alert-error mt-4">
          <div>
            <HiOutlineXCircle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">
                {caught.status} {caught.statusText}
              </h3>
              <div className="text-xs">{caught.data}</div>
            </div>
          </div>
        </div>
      );
  }
}
