import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import IntermediateCertificateForm from "@/components/IntermediateCertificateForm";
import { backend } from "@/constants";
import { CertificateDTO } from "@/types/dto";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const UploadSignedCertificate = ({ params }: { params: { id: string } }) => {
  const uploadSignedCertificate = async (formData: FormData) => {
    "use server";
    const session = await getServerSession(authOptions);
    const intermediateCertificates = JSON.parse(
      formData.get("intermediateCertificate") as string
    );
    const uploadSignedCertificateDTO = {
      rootCA: formData.get("rootCA"),
      chain: [formData.get("signedCertificate"), ...intermediateCertificates],
    };
    const response = await fetch(`${backend}/api/certificates/${params.id}/upload-signed`, {
      method: "PUT",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadSignedCertificateDTO),
    });
    if (response.status == 200) {
      const certificate = (await response.json()) as CertificateDTO;
      redirect(`/certificates/${certificate.id}`);
    }
  };
  return (
    <div>
      <h1>Upload the signed Certificate</h1>
      <form action={uploadSignedCertificate}>
        <div className="w-full  xl:w-3/4">
          <div className="grid grid-cols-1   gap-4 ">
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Signed Certificate</h2>
                <textarea
                  className="textarea min-h-52"
                  placeholder="Signed Certificate"
                  name="signedCertificate"
                />
              </div>
            </div>

            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Intermediate Certificate</h2>
                <IntermediateCertificateForm />
              </div>
            </div>

            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Root CA</h2>
                <textarea
                  className="textarea min-h-52"
                  placeholder="root CA"
                  name="rootCA"
                />
              </div>
            </div>
          </div>
          <button className="bg-blue-500 w-full rounded px-8 py-4 mt-7 text-white font-semibold">
            Upload signed Certfificate
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadSignedCertificate;
