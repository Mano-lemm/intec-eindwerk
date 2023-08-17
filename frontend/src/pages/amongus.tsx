import { monkey_eval } from "monkey_interpreter"
import Link from "next/link"
import { useRef, useState } from "react"

export default function test(){
    const rawText = useRef<HTMLTextAreaElement>(null)
    const [text, setText] = useState("")

    const interpret = () => {
        if(rawText.current == null){
            return
        }
        setText(monkey_eval(rawText.current.value).Inspect())
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <textarea className="bg-slate-100 rounded p-2" ref={rawText} defaultValue={`Hello,\nThis is an online monkey interpreter\nhelp can be found via the \"help\" button\n`} cols={60} rows={20}></textarea>
                <div className="flex p-2 gap-28">
                    <Link className="bg-sky-600/50 p-2 rounded" href={`https://monkeylang.org/`}>Help</Link>
                    <button className="bg-sky-600/50 p-2 rounded" onClick={interpret}>Run</button>
                </div>
                {text == "" ? <></>: <p>{text}</p>}
            </div>
        </>
    )
}