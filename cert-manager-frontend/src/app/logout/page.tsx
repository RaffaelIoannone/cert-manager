"use client";
import { useLogout } from "@/hook/use-logout";

const Logout = () => {
  const { federatedLogout } = useLogout();
  federatedLogout();
  return <></>;
};

export default Logout;
