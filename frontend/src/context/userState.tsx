import * as React from "react";

interface userValue {
  userId: number | undefined;
  userName: string | undefined;
  setUserId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setUserName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const userContext = React.createContext<userValue | undefined>(undefined);

function UserWrapper(props: React.PropsWithChildren) {
  const [userID, setUserID] = React.useState<number | undefined>(undefined);
  const [userName, setUserName] = React.useState<string | undefined>(undefined)
  return (
    <userContext.Provider value={{ userId: userID, setUserId: setUserID, userName: userName, setUserName: setUserName }}>
      {props.children}
    </userContext.Provider>
  );
}

export function useUserContext() {
  return React.useContext(userContext);
}

export default UserWrapper;
