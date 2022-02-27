import { useParams } from "remix";

export default function Contest() {
  const { contestId } = useParams();
  return <div> contestId: {contestId} 比赛详情 </div>;
}
