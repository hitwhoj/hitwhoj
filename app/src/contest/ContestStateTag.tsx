import { Tag } from "@arco-design/web-react";

type Props = {
  beginTime: Date;
  endTime: Date;
};

export function ContestStateTag({ beginTime, endTime }: Props) {
  // because type sucks
  const begin = new Date(beginTime);
  const end = new Date(endTime);

  const status =
    begin > new Date() ? "未开始" : end < new Date() ? "已结束" : "进行中";
  const color =
    begin > new Date() ? "blue" : end < new Date() ? "red" : "green";

  return <Tag color={color}>{status}</Tag>;
}
