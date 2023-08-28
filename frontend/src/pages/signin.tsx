import { faFingerprint, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useUserContext } from "~/context/userState";
import { api } from "~/utils/api";

export default function LoginOrRegister() {
  const router = useRouter();
  const uname = useRef<HTMLTextAreaElement>(null);
  const pwd = useRef<HTMLTextAreaElement>(null);
  const query: { uname: string; pwd: string } = { uname: "", pwd: "" };
  // pretty stupid
  const { refetch: loginRefetch } = api.user.login.useQuery(query, {
    retry: false,
    enabled: false,
  });
  const { refetch: registerRefetch } = api.user.register.useQuery(query, {
    retry: false,
    enabled: false,
  });
  const user = useUserContext();
  if (user == undefined) {
    return <p>Critical failure</p>;
  }

  // TODO: refactor into generic refetch
  const login = () => {
    const name = uname.current?.value;
    const pass = pwd.current?.value;
    if (name != undefined) {
      query.uname = name;
    }
    if (pass != undefined) {
      query.pwd = pass;
    }
    loginRefetch().then((val) => {
      if (val.isError) {
        return;
      }
      const tempUser = val.data;
      if (tempUser == undefined) {
        return;
      }
      user.setUserId(tempUser.id);
      user.setUserName(tempUser.name);
      router.push("/user");
    });
  };

  const register = () => {
    const name = uname.current?.value;
    const pass = pwd.current?.value;
    if (name != undefined) {
      query.uname = name;
    }
    if (pass != undefined) {
      query.pwd = pass;
    }
    registerRefetch().then((val) => {
      if (val.isError) {
        return;
      }
      const tempUID = val.data;
      if (tempUID == undefined) {
        return;
      }
      user.setUserId(tempUID);
      router.push(`/user/${user.userId}`);
    });
  };
  return (
    <>
      <Head>
        <title>Monkey Interpreter</title>
        <meta name="description" content="online interpreter for monkey code" />
        <link rel="icon" href="/out.ico" />
      </Head>
      <div className="flex min-h-screen flex-col items-center gap-20 bg-background py-28 text-white">
        <h1 className=" text-3xl">Monkey Interpreter</h1>
        <div className="flex h-[512px] w-[720px] flex-col items-center gap-16 rounded-[60px] bg-middleground p-9">
          <div className="flex gap-12 rounded-[25px] bg-foreground text-xl">
            <button
              className="rounded-[25px] bg-[#525252] px-[106px] py-9"
              onClick={login}
            >
              Log in
            </button>
            <button
              className="rounded-[25px] bg-[#525252] px-[106px] py-9"
              onClick={register}
            >
              Register
            </button>
          </div>
          <div className="flex flex-col items-center gap-8 px-3 py-10">
            <div className="flex items-center gap-3 px-5 py-3">
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
              <label>username</label>
              <textarea
                ref={uname}
                className="h-6 resize-none text-black"
              ></textarea>
            </div>
            <div className="flex items-center gap-3 px-5 py-3">
              <FontAwesomeIcon icon={faFingerprint}></FontAwesomeIcon>
              <label>password</label>
              <textarea
                ref={pwd}
                className="h-6 resize-none text-black"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
