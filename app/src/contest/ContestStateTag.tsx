type ContestStateTagProps = {
  beginTime: string;
  endTime: string;
};

export function ContestStateTag({ beginTime, endTime }: ContestStateTagProps) {
  const begin = new Date(beginTime);
  const end = new Date(endTime);

  const status =
    begin > new Date() ? "未开始" : end < new Date() ? "已结束" : "进行中";
  const color =
    begin > new Date()
      ? "badge-primary"
      : end < new Date()
      ? "badge-secondary"
      : "badge-accent";

  return <span className={`badge ${color}`}>{status}</span>;
}
