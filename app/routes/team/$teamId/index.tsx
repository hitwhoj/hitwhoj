import { Link } from "remix";

export default function teamDetail() {
  return (
    <>
      <h3>Details</h3>
      <div>团队描述</div>
      <h3>Modules</h3>
      <ul>
        <li>
          <Link to="members">团队成员</Link>
        </li>
        <li>
          <Link to="homework">作业</Link>
        </li>
      </ul>
    </>
  );
}
