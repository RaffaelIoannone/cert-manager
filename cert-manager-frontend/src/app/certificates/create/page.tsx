import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CertificateForm from "@/components/CertificateForm";
import { backend } from "@/constants";
import { CertificateDTO } from "@/types/dto";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const CreateCertificate = () => {
  const createCertificate = async (formData: FormData) => {
    "use server";
    const session = await getServerSession(authOptions);
    const certificateDTO = {
      name: formData.get("name"),
      subject: {
        commonName: formData.get("commonName")
          ? formData.get("commonName")
          : null,
        organization: formData.get("organization")
          ? formData.get("organization")
          : null,
        organizationUnit: formData.get("organizationUnit")
          ? formData.get("organizationUnit")
          : null,
        locality: formData.get("locality") ? formData.get("locality") : null,
        state: formData.get("state") ? formData.get("state") : null,
        country: formData.get("country") ? formData.get("country") : null,
      },
      subjectAlternativeNames: JSON.parse(
        formData.get("subjectAlternativeName") as string
      ),
      key: {
        size: +formData.get("size")!,
        algorithm: formData.get("algorithm"),
        secretEngine: formData.get("secretEngine"),
      },
      certificateAuthority: formData.get("certificateAuthority") === "true",
    };
    const response = await fetch(`${backend}/api/certificates`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(certificateDTO)
    });
    if (response.status == 201) {
      const certificate = await response.json() as CertificateDTO;
      redirect(`/certificates/${certificate.id}`)
    }
  };

  return (
    <div>
      <h1>Create Certificate</h1>
      <CertificateForm action={createCertificate} />
    </div>
  );
};

export default CreateCertificate;
