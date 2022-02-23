import { useParams } from "remix";

export default function Problemset() {
  const { problemsetId } = useParams();
  return <div> problemsetId: {problemsetId} 题单详情 </div>;
}
