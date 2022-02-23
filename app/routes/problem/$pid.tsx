import { useParams } from "remix";

export default function Problem() {
  const { pid } = useParams();
  return <div> problem{pid}题目详情 </div>;
}
