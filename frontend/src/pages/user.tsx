import { useRouter } from "next/router";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { api } from "~/utils/api";
import { useUserContext } from "~/context/userState";
import { monkey_eval } from "monkey_interpreter";
import Link from "next/link";

function interpret(code: string): string {
  return monkey_eval(code).Inspect();
}

function ProjectComp(project: {
  id: number;
  name: string;
  setChosen: Dispatch<SetStateAction<"empty" | "REPL" | "project">>;
}) {
  const user = useUserContext();
  const textref = useRef<HTMLTextAreaElement>(null);
  const [result, setResult] = useState<string>("");
  const codeDetails = api.code.getDetails.useQuery(
    {
      pwd: user?.userPwd ? user.userPwd : "",
      id: project.id,
    },
    {
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchInterval: false,
    },
  );
  const updateCodeParams = { code: "", name: "", codeId: -1, ownerPwd: "" };
  const updateCode = api.code.updateCode.useQuery(updateCodeParams, {
    enabled: false,
  });
  const deleteParams = { id: -1, pwd: "" };
  const deleteCode = api.code.deleteCode.useQuery(deleteParams, {
    enabled: false,
  });

  if (codeDetails.isError) {
    return <p>Error occurred</p>;
  }
  if (codeDetails.isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex flex-col gap-6 px-16 py-8">
      <h1>{codeDetails.data?.name}</h1>
      <textarea
        className="h-128 w-full resize-none text-black"
        defaultValue={codeDetails.data.code}
        ref={textref}
      ></textarea>
      <div className="flex justify-evenly gap-8">
        <button
          className="rounded-lg bg-middleground px-8 py-4 text-slate-50"
          onClick={() => {
            updateCodeParams.code = textref.current?.value
              ? textref.current.value
              : "";
            updateCodeParams.codeId = project.id;
            updateCodeParams.name = codeDetails.data.name;
            updateCodeParams.ownerPwd = user?.userPwd ? user.userPwd : "";
            updateCode.refetch().catch((e) => console.log(e));
          }}
        >
          Save
        </button>
        <button
          className="rounded-lg bg-middleground px-8 py-4 text-slate-50"
          onClick={() => {
            setResult(
              interpret(textref.current?.value ? textref.current.value : ""),
            );
          }}
        >
          Run
        </button>
        <button
          className="rounded-lg bg-middleground px-8 py-4 text-slate-50"
          onClick={() => {
            console.log("amogus");
          }}
        >
          Share
        </button>
        <button
          className="rounded-lg bg-middleground px-8 py-4 text-slate-50"
          onClick={() => {
            deleteParams.id = project.id;
            deleteParams.pwd = user?.userPwd ? user.userPwd : "";
            deleteCode.refetch().catch((e) => console.log(e));
            project.setChosen("empty");
          }}
        >
          Delete
        </button>
      </div>
      <p>{result}</p>
    </div>
  );
}

function ReplComp() {
  return (
    <div className="flex h-full items-center justify-center text-6xl text-slate-200">
      <p className=" h-min">REPL is not yet implemented</p>
    </div>
  );
}

// TODO: add middleware to reroute on not-set user
export default function UserPage() {
  const router = useRouter();
  const user = useUserContext();
  const projects = api.code.getAllProjectTitlesAndIds.useQuery(
    {
      UID: user?.userId == undefined ? -1 : user.userId,
    },
    {
      retry: 3,
    },
  );
  const title = useRef<HTMLInputElement>(null);
  const newProjQuery = {
    ownderId: user?.userId ? user.userId : -1,
    ownderPwd: user?.userPwd ? user.userPwd : "",
    title: title.current?.value ? title.current.value : "",
  };
  const newProject = api.code.newProject.useQuery(newProjQuery, {
    enabled: false,
    retry: 3,
  });
  const [chosen, setChosen] = useState<"project" | "REPL" | "empty">("empty");
  const [project, setProject] = useState<
    { id: number; name: string } | undefined
  >(undefined);

  // page init
  // the slowest redirect ever
  // also doesnt work without js
  // dont do this
  useEffect(() => {
    if (user?.userId == undefined || user.userName == undefined) {
      router.replace("/").catch((e) => {
        console.log(e);
      });
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      projects.refetch();
    }, 500);
  }, [chosen]);
  return (
    <>
      <Head>
        <title>Monkey Interpreter</title>
        <meta name="description" content="online interpreter for monkey code" />
        <link rel="icon" href="/out.ico" />
      </Head>
      <main className="h-screen bg-background text-white">
        <div
          id="header"
          className="flex h-[10%] w-screen items-center bg-middleground text-center text-xl"
        >
          <div className="flex items-center gap-3 p-3">
            <Image src="/logo.png" alt="funny monkey" width={64} height={64} />
            <p>Monkey Interpreter</p>
          </div>
          <div className="flex w-2/5 items-center justify-around p-3">
            <Link href={"https://monkeylang.org/"}>Documentation</Link>
            <Link href={"https://giphy.com/embed/YdjlS7PjMACR6wJrjW"}>Bug report</Link>
          </div>
          <div className="flex w-2/5 flex-row-reverse">
            <button
              className="h-16 w-80 text-center"
              onClick={() => {
                user?.setUserId(undefined);
                user?.setUserName(undefined);
                user?.setUserPwd(undefined);
                router.back();
              }}
            >
              Log out
            </button>
          </div>
        </div>
        <div className="flex h-[90%]">
          <div
            id="side bar"
            className="flex h-full w-80 flex-col gap-4 divide-y divide-black bg-middleground px-4 py-9 text-center text-xl"
          >
            <button
              onClick={() => {
                setChosen("REPL");
              }}
            >
              New REPL
            </button>
            <div className="flex flex-col gap-4 py-4 text-center">
              {projects.data?.codeInfo.map((e) => {
                return (
                  <button
                    onClick={() => {
                      setProject(e);
                      setChosen("project");
                    }}
                    key={e.id}
                  >
                    {e.name}
                  </button>
                );
              })}
              <div className="flex flex-col gap-4 py-4 text-center">
                <button
                  onClick={async () => {
                    try {
                      newProjQuery.title = title.current?.value
                        ? title.current.value
                        : "";
                      await newProject.refetch();
                      await projects.refetch();
                    } catch (e) {}
                  }}
                >
                  New Project
                </button>
                <div className="flex gap-2">
                  <label>Title</label>
                  <input
                    id="new_proj_title"
                    ref={title}
                    className="w-48 text-black"
                  />
                </div>
              </div>
            </div>
          </div>
          <div id="content" className="w-full">
            {chosen == "REPL" ? (
              <ReplComp></ReplComp>
            ) : chosen == "empty" ? (
              <></>
            ) : chosen == "project" ? (
              <ProjectComp
                id={project?.id ? project.id : -1}
                name={project?.name ? project.name : ""}
                setChosen={setChosen}
              ></ProjectComp>
            ) : (
              <p>type Error</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
