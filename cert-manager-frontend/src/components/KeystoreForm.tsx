import { CertificateDTO } from "@/types/dto";
import React from "react";
import KeystoreCertificatesTable from "./KeystoreCertificatesTable";

const KeystoreForm = ({
  action,
  certificates,
}: {
  action: (formData: FormData) => void;
  certificates: CertificateDTO[];
}) => {
  return (
    <form action={action}>
      <div className="w-full">
        <div className="grid grid-cols-1 gap-4 ">
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">General</h2>
              <label className="label">
                <span className="label-text">Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. mtls-keystore"
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <label className="label flex-col items-start">
                <span className="label-text">Description</span>
                <textarea
                  className="textarea textarea-bordered min-h-52 w-full"
                  placeholder="Description"
                  name="description"
                />
              </label>
            </div>
          </div>
          <KeystoreCertificatesTable certificates={certificates} />
        </div>
        <button className="bg-blue-500 w-full rounded px-8 py-4 mt-7 text-white font-semibold">
          Create Keystore
        </button>
      </div>
    </form>
  );
};

export default KeystoreForm;
