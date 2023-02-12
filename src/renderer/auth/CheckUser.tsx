import { navStore } from "renderer/store/navStore";
import { userStore } from "renderer/store/userStore";
import { AppPage } from "../app/AppPage";

export const CheckUser = () => {
  const user = userStore((s) => s.user);
  const nav = navStore((s) => s.nav);
  if (!user) {
    nav("/");
    return <div />;
  }

  return <AppPage />;
};
