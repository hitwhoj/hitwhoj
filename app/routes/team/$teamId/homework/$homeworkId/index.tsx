import { useParams, Link, json, useLoaderData } from "remix";
import { LoaderFunction } from "remix";
// import { invariant } from "~/utils/invariant";
export const loader: LoaderFunction = async ({ params }) => {
  const hid = params.homeworkId;
  return json({ hid });
};

export default function Record() {
  const { homeworkId } = useParams();

  return (
    <>
      <h3>{homeworkId}</h3>
      <h3>详情</h3>
      <div>作业描述</div>
      <div>截止时间</div>
      <h3>Operation</h3>
      <ul>
        <li>
          <Link to="edit">Edit</Link>{" "}
        </li>
        <li>Delete</li>
      </ul>

      <h3>题单列表</h3>
      <ul>
        <li>
          <Link to="/problemset/题单1">题单1</Link>{" "}
        </li>
      </ul>
    </>
  );
}
