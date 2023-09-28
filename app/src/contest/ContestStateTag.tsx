type ContestStateTagProps = {
  beginTime: string;
  endTime: string;
  isdeleted: boolean;
};

export function ContestStateTag({
  beginTime,
  endTime,
  isdeleted,
}: ContestStateTagProps) {
  const begin = new Date(beginTime);
  const end = new Date(endTime);

  let status: string, color: string;

  if (isdeleted) {
    status = "已删除";
    color = "badge-danger"; // 如果已删除，使用红色样式
  } else if (begin > new Date()) {
    status = "未开始";
    color = "badge-primary";
  } else if (end < new Date()) {
    status = "已结束";
    color = "badge-secondary";
  } else {
    status = "进行中";
    color = "badge-accent";
  }

  return <span className={`badge ${color}`}>{status}</span>;
}
