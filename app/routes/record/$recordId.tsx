import { useParams } from "remix";

export default function Record() {
  const { recordId } = useParams();
  return <div> recordId记录详情: {recordId} </div>;
}
