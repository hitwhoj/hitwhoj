import { Typography, Link as ArcoLink } from "@arco-design/web-react";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => ({
  title: "帮助 - HITwh OJ",
});

export default function HelpIndex() {
  return (
    <Typography>
      <Typography.Title heading={3}>帮助</Typography.Title>
      <Typography.Paragraph>
        欢迎使用哈尔滨工业大学（威海）在线评测平台，这里是本站的帮助页面。
      </Typography.Paragraph>

      <Typography.Title heading={4}>使用说明</Typography.Title>
      <Typography.Paragraph>
        <ul>
          <li>
            <ArcoLink>
              <Link to="/docs/judge">评测相关说明</Link>
            </ArcoLink>
          </li>
          <li>
            <ArcoLink>
              <Link to="/docs/license">开源协议</Link>
            </ArcoLink>
          </li>
        </ul>
      </Typography.Paragraph>

      <Typography.Title heading={4}>技术相关</Typography.Title>
      <Typography.Paragraph>
        <ul>
          <li>
            <ArcoLink>
              <Link to="/docs/deploy">部署网站</Link>
            </ArcoLink>
          </li>
          <li>
            <ArcoLink>
              <Link to="/docs/deploy-judge">部署评测机</Link>
            </ArcoLink>
          </li>
        </ul>
      </Typography.Paragraph>

      <Typography.Title heading={4}>外部链接</Typography.Title>
      <Typography.Paragraph>
        <ul>
          <li>
            <ArcoLink>
              <a href="https://git.hit.edu.cn/hitwhoj/hitwhoj">开源代码</a>
            </ArcoLink>
          </li>
          <li>
            <ArcoLink>
              <a href="https://mc.hitwh.moe">Minecraft 服务器</a>
            </ArcoLink>
          </li>
        </ul>
      </Typography.Paragraph>
    </Typography>
  );
}
