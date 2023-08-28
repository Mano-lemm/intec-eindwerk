import { faFileLines, faUser } from "@fortawesome/free-solid-svg-icons";
import { faNpm } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

/* eslint-disable */
// this is a Typescript helper type
// that displays all the keys and
// the types of those keys of any
// opaque type
export type Pretty<T> = {
  [K in keyof T]: T[K];
} & {};
/* eslint-enable */

// const x: Pretty<IconProp>
// const y: Pretty<IconName> = "file"

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Monkey Interpreter</title>
        <meta name="description" content="online interpreter for monkey code" />
        <link rel="icon" href="/out.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        {/* should be moved into a function */}
        <div className="flex gap-5 rounded-[45px] bg-middleground p-5 text-white shadow-big_outer">
          {/* should be moved into a function */}
          <div className="flex flex-col gap-10 rounded-3xl bg-background px-10 py-8 shadow-big_inner">
            <Link className="flex items-center gap-6 py-5" href={"https://regal-internet-brothers.github.io/monkey/docs/Programming_Language%20reference.html"}>
              <FontAwesomeIcon className="w-6" icon={faFileLines} />
              <p>Documentation</p>
            </Link>
            <button
              className="flex items-center gap-6 py-5"
              onClick={() => router.push("/signin")}
            >
              <FontAwesomeIcon className="w-6" icon={faUser} />
              <p>Log in/Register</p>
            </button>
          </div>
          <div className="flex flex-col gap-10 rounded-3xl bg-background px-10 py-8 shadow-big_inner">
            <Link className="flex items-center gap-6 py-5" href={"https://interpreterbook.com/"}>
              <FontAwesomeIcon className="w-6" icon={faFileLines} />
              <p>Book sources</p>
            </Link>
            <Link className="flex items-center gap-6 py-5" href={`https://www.npmjs.com/package/monkey_interpreter`}>
              <FontAwesomeIcon className="w-10" icon={faNpm} />
              <p>
                Npm package
              </p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
