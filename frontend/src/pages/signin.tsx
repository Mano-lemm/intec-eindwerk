import { faFingerprint, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoginOrRegister() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center gap-20 bg-background py-28 text-white">
        <h1 className=" text-3xl">Monkey Interpreter</h1>
        <div className="flex h-[512px] w-[720px] flex-col items-center gap-16 rounded-[60px] bg-middleground p-9">
          <div className="flex gap-12 rounded-[25px] bg-foreground text-xl">
            <button className="rounded-[25px] bg-[#525252] px-[106px] py-9">
              Log in
            </button>
            <button className="rounded-[25px] bg-[#525252] px-[106px] py-9">
              Register
            </button>
          </div>
          <div className="flex flex-col items-center gap-8 px-3 py-10">
            <div className="flex items-center gap-3 px-5 py-3">
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
              <label>username</label>
              <textarea className="h-6 resize-none text-black"></textarea>
            </div>
            <div className="flex items-center gap-3 px-5 py-3">
              <FontAwesomeIcon icon={faFingerprint}></FontAwesomeIcon>
              <label>password</label>
              <textarea className="h-6 resize-none text-black"></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
