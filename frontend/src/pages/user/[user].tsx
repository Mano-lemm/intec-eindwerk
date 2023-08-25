import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import Head from "next/head";

function projectComp(user: string, project: string) {
  return <p>{`${user} : ${project}`}</p>;
}

function replComp() {
  return <p>REPL</p>;
}

export default function UserPage() {
  const router = useRouter();
  const fakeProjectTitles = ["sus", "amongus", "imposter"];

  const [chosen, setChosen] = useState<"project" | "REPL" | "empty">("empty");
  const [project, setProject] = useState<string | undefined>(undefined);

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
            <button className="h-16 w-80 text-center">Log out</button>
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
              {fakeProjectTitles.map((e) => {
                return (
                  <button
                    onClick={() => {
                      setProject(e);
                      setChosen("project");
                    }}
                    key={e}
                  >
                    {e}
                  </button>
                );
              })}
            </div>
          </div>
          <div id="content" className="h-full w-full">
            {chosen == "REPL" ? (
              replComp()
            ) : chosen == "empty" ? (
              <></>
            ) : chosen == "project" ? (
              projectComp(String(router.query.user), String(project))
            ) : (
              <p>type Error</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
