import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineQuestionMarkCircle,
  HiX,
} from "react-icons/hi";
import { AiOutlineHistory, AiOutlineQq, AiOutlineWechat } from "react-icons/ai";
import { useComputed, useSignal } from "@preact/signals-react";
import { useToasts } from "~/utils/toast";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import hitwh from "~/assets/hitwh.png";
import { FaTelegramPlane } from "react-icons/fa";
import { SiElement } from "react-icons/si";
import adimg from "~/assets/ad.jpg";
import style from "~/styles/app.css";
import katexStyle from "katex/dist/katex.css";
import qqgroup from "~/assets/qq.svg";
import { Link } from "@remix-run/react";
import { findRequestUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import { selectUserData } from "~/utils/db/user";
import { useSignalLoaderData } from "~/utils/hooks";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: style },
  { rel: "stylesheet", href: katexStyle },
  { rel: "preload", href: adimg, as: "image" },
  { rel: "preload", href: hitwh, as: "image" },
  { rel: "preload", href: qqgroup, as: "image" },
];

const qqlink =
  "https://qm.qq.com/cgi-bin/qm/qr?k=uFHY05vPwIamUXG6L-xDQvhkA0acwZqA&jump_from=webapi&authKey=96ylLScWBoTxF6zMOsP7wdIbC/7PN1bMs5T74AIOpqeBE6h4NAGnYx/ngkxkVhyx";

// this make sure @tailwind compiles

const ads = [
  {
    title: "广告位0招租",
    content: "广告位滞销，救救我们😭",
    image: adimg,
  },
  {
    title: "广告位1招租",
    content: "广告位1滞销，救救我们😭",
    image: adimg,
  },
  {
    title: "广告位2招租",
    content: "广告位2滞销，救救我们😭",
    image: adimg,
  },
];
export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  if (!self.userId) {
    return json({ user: null });
  }

  const user = await db.user.findUnique({
    where: { id: self.userId! },
    select: selectUserData,
  });

  return json({ user });
}
export default function Footer() {
  const Toasts = useToasts();
  const loaderData = useSignalLoaderData<typeof loader>();
  const showFooterAdvertise = useSignal(true);
  const user = useComputed(() => loaderData.value.user);
  return (
    <footer className="footer bg-neutral text-neutral-content p-10">
      {/* About */}
      <div>
        <span className="footer-title">About</span>
        <a href="https://www.hitwh.edu.cn/" target="_blank" rel="noreferrer">
          <div
            className="bg-neutral-content h-[48px] w-[221px]"
            style={{
              maskImage: `url(${hitwh})`,
              maskSize: "cover",
              WebkitMaskImage: `url(${hitwh})`,
              WebkitMaskSize: "cover",
            }}
          />
        </a>
        <p>
          HITwh OJ Dev Team. Presents
          <br />
          Providing unstable service since 2022
        </p>
      </div>
      {/* Advertisement */}
      <div className={showFooterAdvertise.value ? "max-w-sm" : "hidden"}>
        <span className="footer-title">
          Advertisement
          <button
            className="btn btn-circle btn-xs ml-3"
            onClick={() => (showFooterAdvertise.value = false)}
          >
            <HiX />
          </button>
        </span>
        <div className="carousel w-full">
          {ads.map((ad, idx) => (
            <div
              key={idx}
              id={`advertise-${idx}`}
              className="card carousel-item card-side w-full"
            >
              <figure>
                <img
                  src={ad.image}
                  alt="ad"
                  className="h-24 w-24 cursor-pointer"
                  onClick={() => Toasts.info("您获得了「屠龙宝刀」*1")}
                />
              </figure>
              <div className="card-body">
                <div className="card-title">{ad.title}</div>
                <p>{ad.content}</p>
                <div className="card-actions justify-end">
                  <a
                    className="btn btn-circle btn-sm"
                    href={`#advertise-${(idx - 1 + ads.length) % ads.length}`}
                  >
                    <HiOutlineChevronLeft />
                  </a>
                  <a
                    className="btn btn-circle btn-sm"
                    href={`#advertise-${(idx + 1) % ads.length}`}
                  >
                    <HiOutlineChevronRight />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span className="footer-title">state</span>
        <div className="grid grid-flow-col gap-4">
          <Link className="flex gap-4" to="/1/docs">
            <HiOutlineQuestionMarkCircle className="h-6 w-6" />
            <span>文档</span>
          </Link>
          <div className="grid grid-flow-col gap-4">
            <Link
              className="flex gap-4"
              to={user.value ? `/1/record?uid=${user.value.id}` : "/1/record"}
            >
              <AiOutlineHistory className="h-6 w-6" />
              <span>评测</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Contact */}
      <div>
        <span className="footer-title">Contact</span>
        <div className="grid grid-flow-col gap-4">
          <a
            target="_blank"
            href={qqlink}
            className="tooltip tooltip-bottom tooltip-info"
            data-tip="HITwh OJ 反馈×吹水"
            rel="noreferrer"
          >
            <AiOutlineQq className="h-6 w-6" />
          </a>
          <span
            className="tooltip tooltip-bottom tooltip-info"
            data-tip="很遗憾，我们并没有微信反馈群~"
          >
            <AiOutlineWechat className="h-6 w-6" />
          </span>
          <a
            href="https://t.me/hitwhmoe"
            target="_blank"
            rel="noreferrer"
            className="tooltip tooltip-bottom tooltip-info"
            data-tip="@hitwhmoe"
          >
            <FaTelegramPlane className="h-6 w-6" />
          </a>
          <a
            href="https://matrix.to/#/#hitwh:mozilla.org"
            target="_blank"
            rel="noreferrer"
            className="tooltip tooltip-bottom tooltip-info"
            data-tip="#hitwh:mozilla.org"
          >
            <SiElement className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
