import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import KeystoreDownloadForm from "@/components/KeystoreDownloadForm";
import { backend } from "@/constants";
import { DownloadKeystoreFormState } from "@/types";
import { KeystoreDTO,  } from "@/types/dto";
import { getServerSession } from "next-auth";
import React from "react";

const DownloadKeystore = async ({ params }: { params: { id: string } }) => {
  const downloadKeystore = async (state: DownloadKeystoreFormState, payload: FormData) => {
    "use server";
    const session = await getServerSession(authOptions);
    const createKeystoreFileDTO = {
      type: payload.get("type"),
      filename: payload.get("filename"),
      password: payload.get("password"),
      entries: JSON.parse(payload.get("entries") as string),
    };
    const response = await fetch(`${backend}/api/keystores/${params.id}/file`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createKeystoreFileDTO),
    });


    if (response.status == 200) {
      const data = await response.arrayBuffer()
      const buffer = Buffer.from(data);
      const b64data = buffer.toString('base64');
      return {data: b64data, filename: createKeystoreFileDTO.filename as string}
    }
    return {data: state.data, filename: state.filename} 
  };
  const session = await getServerSession(authOptions);
  const response = await fetch(`${backend}/api/keystores/${params.id}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });
  if (response.status == 200) {
    const keystore = (await response.json()) as KeystoreDTO;
    return (
      <div>
        <h1>Download the Keystore</h1>
        <KeystoreDownloadForm action={downloadKeystore} keystore={keystore} />
      </div>
    );
  }
};

export default DownloadKeystore;

