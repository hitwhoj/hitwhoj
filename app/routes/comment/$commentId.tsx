import { useParams } from "remix";

export default function Comment() {
  const { commentId } = useParams();
  return <div> commentId帖子详情: {commentId} </div>;
}
