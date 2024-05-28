"use client";

import { KeystoreDTO, KeystoreType } from "@/types/dto";
import React from "react";
import KeystoreDownloadCertificatesTable from "./KeystoreDownloadCertificatesTable";
import { useFormState } from "react-dom";
import { DownloadKeystoreFormState } from "@/types";
import BackButton from "./BackButton";

const KeystoreDownloadForm = ({
  action,
  keystore,
}: {
  action: (
    state: DownloadKeystoreFormState,
    payload: FormData
  ) => Promise<DownloadKeystoreFormState>;
  keystore: KeystoreDTO;
}) => {
  const [keystoreData, formAction] = useFormState<
    DownloadKeystoreFormState,
    FormData
  >(action, { data: null, filename: "" });
  return (
    <form action={formAction}>
      {keystoreData.data === null ? (
        <>
          <div className="grid grid-cols-1 gap-4 ">
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2>General</h2>
                <label className="label">
                  <span className="label-text">Filename</span>
                  <input
                    type="text"
                    name="filename"
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="label">
                  <span className="label-text">Keystore Type</span>
                  <select
                    name="type"
                    className="select select-bordered w-full max-w-xs"
                    defaultValue={KeystoreType.PKCS12 as string}
                  >
                    <option value="PKCS12">PKCS 12</option>
                    <option value="JKS">JKS</option>
                  </select>
                </label>
                <label className="label">
                  <span className="label-text">Keystore Password</span>
                  <input
                    type="password"
                    name="password"
                    autoComplete="off"
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
              </div>
            </div>
            <KeystoreDownloadCertificatesTable entries={keystore.entries} />
          </div>

          <button className="bg-blue-500 w-full rounded px-8 py-4 mt-7 text-white font-semibold">
            Create your certificate file
          </button>
        </>
      ) : (
        <>
          <button
            className="bg-blue-500 w-full rounded px-8 py-4 mt-7 text-white font-semibold"
            onClick={async (e) => {
              e.preventDefault();
              const byteCharacters = atob(keystoreData.data as string);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray]);
              const temp = document.createElement("a");
              temp.href = URL.createObjectURL(blob);
              temp.download = keystoreData.filename;
              temp.click();
            }}
          >
            Download keystore
          </button>
          <BackButton>Going back</BackButton>
        </>
      )}
    </form>
  );
};

export default KeystoreDownloadForm;
