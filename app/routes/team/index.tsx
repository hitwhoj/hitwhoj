import { Link, Form, ActionFunction, redirect } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const teamName = form.get("teamName")?.toString();
  if (!teamName)
    return new Response("teamName is not registered", { status: 400 });
  return redirect(`/team/${teamName}`);
};

export default function TeamList() {
  return (
    <>
      <div>
        <Form
          method="post"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input type="text" name="teamName" placeholder="teamName" required />
          <button type="submit">search</button>
        </Form>
      </div>
      <h1> Public teamList </h1>
      <ul>
        <li>
          <Link to="1">1队</Link>
        </li>
      </ul>
    </>
  );
}
