import { type AppType } from "next/dist/shared/lib/utils";
import UserWrapper from "~/context/userState";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <UserWrapper>
      <Component {...pageProps} />
    </UserWrapper>
  );
};

export default api.withTRPC(MyApp);
