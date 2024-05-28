import { getServerSession } from "next-auth";
import React from "react";
import { backend } from "@/constants";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BackButton from "@/components/BackButton";
import { CertificateDTO } from "@/types/dto";
import { redirect } from "next/navigation";

const DeployAwsCertificate = async ({ params }: { params: { id: string } }) => {
  const deployAwsCertificate = async () => {
    "use server";
    const session = await getServerSession(authOptions);
    const response = await fetch(
      `${backend}/api/certificates/${params.id}/deploy-aws`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status == 200) {
      const certificate = (await response.json()) as CertificateDTO;
      redirect(`/certificates/${certificate.id}`);
    }
  };
  return (
    <div>
      <h1>Deploy the Certificate to AWS</h1>
      <form action={deployAwsCertificate}>
        <div className="grid grid-cols-1 gap-4 ">
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2>
                Are you sure that you want to deploy this certificate to AWS?
              </h2>
              <button className="bg-blue-500 w-full rounded px-8 py-4 mt-7 text-white font-semibold">
                Deploy your certificate
              </button>
              <BackButton>Going back</BackButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeployAwsCertificate;
