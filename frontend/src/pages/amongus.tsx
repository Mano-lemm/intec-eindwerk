import { monkey_eval } from "monkey_interpreter";
import Link from "next/link";
import { useRef, useState } from "react";

export default function Test() {
  const rawText = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");

  const interpret = () => {
    if (rawText.current == null) {
      return;
    }
    setText(monkey_eval(rawText.current.value).Inspect());
  };

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <textarea
          className="rounded bg-slate-100 p-2"
          ref={rawText}
          defaultValue={`Hello,\nThis is an online monkey interpreter\nhelp can be found via the \"help\" button\n`}
          cols={60}
          rows={20}
        ></textarea>
        <div className="flex gap-28 p-2">
          <Link
            className="rounded bg-sky-600/50 p-2"
            href={`https://monkeylang.org/`}
          >
            Help
          </Link>
          <button className="rounded bg-sky-600/50 p-2" onClick={interpret}>
            Run
          </button>
        </div>
        {text == "" ? <></> : <p>{text}</p>}
      </div>
    </>
  );
}
