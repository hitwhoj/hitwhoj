import { Link } from "remix";

export default function HomeworkList() {
  return (
    <>
      <h3>Operation</h3>
      <ul>创建作业</ul>

      <h3> homeworkList </h3>
      <div>
        <ul>
          <li>
            <Link to="作业1">作业1</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
