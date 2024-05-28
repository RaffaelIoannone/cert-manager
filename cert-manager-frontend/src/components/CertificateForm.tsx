import React from "react";
import SubjectAlternativeNameForm from "./SubjectAlternativeNameForm";
import { CertificateDTO } from "@/types/dto";

const CertificateForm = ({ action, certificate }: { action: (formData: FormData) => void,  certificate?: CertificateDTO}) => {
  return (
    <form action={action}>
        <div className="w-full  xl:w-3/4">
          <div className="grid grid-cols-1 lg:grid-cols-2  gap-4 ">
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">General</h2>
                <label className="label">
                  <span className="label-text">Name</span>
                  <input
                    type="text"
                    name="name"
                    defaultValue={certificate?.name}
                    placeholder="e.g. example-mtls"
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="label">
                  <span className="label-text">Type</span>
                  <select
                    name="certificateAuthority"
                    className="select select-bordered w-full max-w-xs"
                    defaultValue={certificate?.certificateAuthority ? "true": "false"}
                  >
                    <option value="true">Certificate Authority</option>
                    <option value="false">
                      Leaf Certificate
                    </option>
                  </select>
                </label>
              </div>
            </div>
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Subject Alternative Name</h2>
                <SubjectAlternativeNameForm subjectAlternativeNames={certificate?.subjectAlternativeNames} />
              </div>
            </div>

            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Key</h2>
                <label className="label">
                  <span className="label-text">Size</span>
                  <select
                    name="size"
                    className="select select-bordered w-full max-w-xs"
                    defaultValue={certificate?.key?.size}
                  >
                    <option value="2048">2048 bit</option>
                    <option value="4096">4096 bit</option>
                    <option value="8192">8192 bit</option>
                  </select>
                </label>
                <label className="label">
                  <span className="label-text">Algorithm</span>
                  <select
                    name="algorithm"
                    className="select select-bordered w-full max-w-xs"
                    defaultValue={certificate?.key?.algorithm}
                  >
                    <option value="RSA">RSA</option>
                  </select>
                </label>
                <label className="label">
                  <span className="label-text">Secret Engine</span>
                  <select
                    name="secretEngine"
                    className="select select-bordered w-full max-w-xs"
                    defaultValue={certificate?.key?.secretEngine}
                  >
                    <option value="JAVA">Java</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Distinguished Name (Subject)</h2>
                <label className="label">
                  <span className="label-text">commonName</span>
                  <input
                    type="text"
                    name="commonName"
                    placeholder="e.g. example.com"
                    className="input input-bordered w-full max-w-xs"
                    defaultValue={certificate?.subject?.commonName}
                  />
                </label>
                <label className="label">
                  <span className="label-text">organization</span>
                  <input
                    type="text"
                    name="organization"
                    placeholder="e.g. Example AG"
                    className="input input-bordered w-full max-w-xs"
                    defaultValue={certificate?.subject?.organization}
                  />
                </label>
                <label className="label">
                  <span className="label-text">organizationUnit</span>
                  <input
                    type="text"
                    name="organizationUnit"
                    placeholder="e.g. IT department"
                    className="input input-bordered w-full max-w-xs"
                    defaultValue={certificate?.subject?.organizationUnit}
                  />
                </label>
                <label className="label">
                  <span className="label-text">locality</span>
                  <input
                    type="text"
                    name="locality"
                    placeholder="e.g. Winterthur"
                    className="input input-bordered w-full max-w-xs"
                    defaultValue={certificate?.subject?.locality}
                  />
                </label>
                <label className="label">
                  <span className="label-text">state</span>
                  <input
                    type="text"
                    name="state"
                    placeholder="e.g. Zuerich"
                    className="input input-bordered w-full max-w-xs"
                    defaultValue={certificate?.subject?.state}
                  />
                </label>
                <label className="label">
                  <span className="label-text">country</span>
                  <input
                    type="text"
                    name="country"
                    placeholder="e.g. CH"
                    className="input input-bordered w-full max-w-xs"
                    defaultValue={certificate?.subject?.country}
                  />
                </label>
              </div>
            </div>
          </div>
          <button className="bg-blue-500 w-full rounded px-8 py-4 mt-7 text-white font-semibold">
            Create Certfificate
          </button>
        </div>
      </form>
  );
};

export default CertificateForm;
