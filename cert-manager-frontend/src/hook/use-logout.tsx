import { signOut } from "next-auth/react";

export const useLogout = () => {
  return { federatedLogout };
};

const federatedLogout = async () => {
  try {
    const response = await fetch("/api/auth/federated-logout");
    const data = await response.json();
    if (response.ok) {
      await signOut({ redirect: false });
      window.location.href = data.url;
      return;
    }
    throw new Error(data.error);
  } catch (error) {
    console.log(error)
    await signOut({ callbackUrl: "/", redirect: true });
  }
};
