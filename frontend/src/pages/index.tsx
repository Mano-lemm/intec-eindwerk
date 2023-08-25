import { faFileLines, faUser } from "@fortawesome/free-solid-svg-icons";
import { faNpm } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import Link from "next/link";

/* eslint-disable */
// this is a Typescript helper type
// that displays all the keys and
// the types of those keys of any
// opaque type
type Pretty<T> = {
  [K in keyof T]: T[K];
} & {};
/* eslint-enable */

// const x: Pretty<IconProp>
// const y: Pretty<IconName> = "file"

export default function Home() {
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
            <button className="flex items-center gap-6 py-5">
              <FontAwesomeIcon className="w-6" icon={faFileLines} />
              <p>Documentation</p>
            </button>
            <button className="flex items-center gap-6 py-5">
              <FontAwesomeIcon className="w-6" icon={faUser} />
              <p>Log in/Register</p>
            </button>
          </div>
          <div className="flex flex-col gap-10 rounded-3xl bg-background px-10 py-8 shadow-big_inner">
            <button className="flex items-center gap-6 py-5">
              <FontAwesomeIcon className="w-6" icon={faFileLines} />
              <p>Book sources</p>
            </button>
            <button className="flex items-center gap-6 py-5">
              <FontAwesomeIcon className="w-10" icon={faNpm} />
              <Link href={`https://www.npmjs.com/package/monkey_interpreter`}>Npm package</Link>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
