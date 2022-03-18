import {
  useLoaderData,
  LoaderFunction,
  json,
  ActionFunction,
  Form,
  useActionData,
  redirect
}from "remix"
import { db } from "~/utils/db.server";

type LoaderData = {
  name: string;
  description: string | null;
  ddl: Date;
  problemSets: {
    sid: number;
    title: string;
  }[];
};

export const loader:LoaderFunction = async({params})=>{
  const hid = params.homeworkId;
  const homework = await db.teamHomework.findUnique({
    where: {
      hid: hid,
    },
    include: {
      problemsets: {
        select: {
          sid: true,
          title: true,
        },
      },
    },
  });
  if (!homework) {
    throw new Response("Homework not found", { status: 404 });
  }
  const data: LoaderData = {
    name: homework.name,
    description: homework.description,
    ddl: homework.ddl,
    problemSets: homework.problemsets,
  };

  return json(data);
  
}

type ProblemSetData = {
  sid:number,
}[]

export const action: ActionFunction = async ({ params, request }) => {
  const tid:string = params.teamId?params.teamId:"";
  const hid:string = params.homeworkId?params.homeworkId:"";
  const form = await request.formData();
  let tmp = form.get('name')?.toString();
  const name:string = tmp?tmp:"";
  const description = form.get('description')?.toString();
  const ddl:Date = new Date( form.get('ddl')?.toString() as string);
  const problemsetsIdstr = form.get('problemsets')?.toString().split(',');
  var problemsetsId = problemsetsIdstr?.map(Number);
  if(!problemsetsId){
    return new Response("problemsets is missing", { status: 400 });
  }

  var problems:ProblemSetData = [];
  for(let i=0;i<problemsetsId.length;i++){
    problems.push({sid:problemsetsId[i]}) ;
  }




  await db.teamHomework.update(
    {
      data:{
          name:name,
          ddl:ddl,
          description:description,
          updatedAt:new Date(Date.now()),
          problemsets:{
            set:[],
            connect:problems
          }
      },
      where:{
        hid:hid
      }
    }
  ).catch(()=>{
    return new Response("update fail", { status: 500 });
  })


  return redirect(`/team/${tid}/homework/${hid}`);
}

export default function editHomework() {
  const data = useLoaderData<LoaderData>();
  const problems:number[] = [];
  for(let i=0;i<data.problemSets.length;i++){
    problems.push(data.problemSets[i].sid);
  }

  const error = useActionData<string>();
  return (
  <>
  <div>编辑作业</div>
  <Form method="post" style={{ display: "flex", flexDirection: "column" }}>

        <input type="text" name="name" placeholder="name"  required />
        <textarea name="description" id="description" cols={30} rows={10}  ></textarea>
        <input type="datetime-local" name="ddl" />
        <input type="text" name="problemsets" placeholder="problemsetsId(join with',')" required/>

        <button type="submit">confirm update</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Form>
     </>
  );
}
