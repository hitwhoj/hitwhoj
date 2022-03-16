import { Link } from "remix";

export default function MemberList() {
  return (
    <>
      <h3>Operation</h3>
      <ul>
        <li>添加成员</li>
        <li>删除成员</li>
      </ul>

      <h3> memberList </h3>
      <ul>
        <li>
          <Link to="/">成员1</Link>
        </li>
      </ul>
    </>
  );
}
