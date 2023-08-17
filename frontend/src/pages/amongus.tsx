import { monkey_eval } from "monkey_interpreter"
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
            <div className="flex flex-col items-center justify-center h-screen border-cyan-300 border-8">
                <textarea className="bg-slate-100" ref={rawText} defaultValue="" cols={60} rows={20}></textarea>
                <button onClick={interpret}>amogus</button>
                {text == "" ? <></>: <p>{text}</p>}
            </div>
        </>
    )
}