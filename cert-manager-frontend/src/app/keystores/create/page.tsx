import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import KeystoreForm from "@/components/KeystoreForm";
import { backend } from "@/constants";
import { CertificateDTO, KeystoreDTO } from "@/types/dto";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const CreateKeystore = async () => {
  const createKeystore = async (formData: FormData) => {
    "use server";
    const session = await getServerSession(authOptions);
    const keystoreDTO = {
      name: formData.get("name"),
      description: formData.get("description"),
      entries: JSON.parse(formData.get("entries") as string),
    };
    const response = await fetch(`${backend}/api/keystores`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keystoreDTO),
    });
    if (response.status == 201) {
      const keystore = (await response.json()) as KeystoreDTO;
      redirect(`/keystores/${keystore.id}`);
    }
  };
  const session = await getServerSession(authOptions);
  let certificates: CertificateDTO[] = [];
  const response = await fetch(`${backend}/api/certificates?keystore=true`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });
  if (response.status == 200) {
    certificates = (await response.json()) as CertificateDTO[];
  }
  return (
    <div>
      <h1>Create Keystore</h1>
      <KeystoreForm action={createKeystore} certificates={certificates} />
    </div>
  );
};

export default CreateKeystore;
