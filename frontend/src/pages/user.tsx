import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { api } from "~/utils/api";
import { useUserContext } from "~/context/userState";

function projectComp(user: string, project: string) {
  return <p>{`${user} : ${project}`}</p>;
}

function replComp() {
  return <p>REPL</p>;
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
  let title = useRef<HTMLInputElement>(null);
  const newProjQuery = { 
    ownderId: user?.userId ? user.userId : -1,
    ownderPwd: user?.userPwd ? user.userPwd : "",
    title: title.current?.value ? title.current.value : "",
  }
  const newProject = api.code.newProject.useQuery(
    newProjQuery,
    {
      enabled: false,
      retry: 3,
    },
  );
  const [chosen, setChosen] = useState<"project" | "REPL" | "empty">("empty");
  const [project, setProject] = useState<string | undefined>(undefined);

  // page init
  // the slowest redirect ever
  // also doesnt work without js
  // dont do this
  useEffect(() => {
    if (
      user == undefined ||
      user.userId == undefined ||
      user.userName == undefined
    ) {
      router.replace("/");
    }
  }, []);
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
          className="flex w-screen items-center bg-middleground text-center text-xl"
        >
          <div className="flex items-center gap-3 p-3">
            <Image src="/logo.png" alt="funny monkey" width={64} height={64} />
            <p>Monkey Interpreter</p>
          </div>
          <div className="flex w-2/5 items-center justify-around p-3">
            <button>Documentation</button>
            <button className="h-16">Bug report</button>
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
        <div className="flex h-full">
          <div
            id="side bar"
            className="flex w-80 flex-col gap-4 divide-y divide-black bg-middleground px-4 py-9 text-center text-xl"
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
                      setProject(e.name);
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
                      newProjQuery.title = title.current?.value ? title.current.value : "";
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
          <div id="content" className="h-full w-full">
            {chosen == "REPL" ? (
              replComp()
            ) : chosen == "empty" ? (
              <></>
            ) : chosen == "project" ? (
              projectComp(String(user?.userName), String(project))
            ) : (
              <p>type Error</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
