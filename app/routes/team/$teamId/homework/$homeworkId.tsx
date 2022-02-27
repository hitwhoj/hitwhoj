import { useParams } from "remix";

export default function Record() {
  const { homeworkId } = useParams();
  return <div> homeworkId作业详情: {homeworkId} </div>;
}
