import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BackButton from "@/components/BackButton";
import { backend } from "@/constants";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const DeleteKeystore = ({ params }: { params: { id: string } }) => {
  const deleteKeystore = async () => {
    "use server";
    const session = await getServerSession(authOptions);
    const response = await fetch(
      `${backend}/api/keystores/${params.id}`,
      {
        method: "DELETE",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status == 200) {
      redirect(`/keystores`);
    }
  };
  return (
    <div>
      <h1>Delete the Keystore</h1>
      <form action={deleteKeystore}>
        <div className="grid grid-cols-1 gap-4 ">
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2>Are you sure that you want to delete this keystore?</h2>
              <p>This step, once done, can not be reverted!</p>
              <button className="bg-blue-500 w-full rounded px-8 py-4 mt-7 text-white font-semibold">
                Delete your keystore
              </button>
              <BackButton>
                Going back
              </BackButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeleteKeystore;
