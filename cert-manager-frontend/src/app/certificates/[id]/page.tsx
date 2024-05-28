import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminRole, backend } from "@/constants";
import { getServerSession } from "next-auth";
import React from "react";
import { CertificateDTO, CertificateState } from "@/types/dto";
import { useHelper } from "@/hook/use-helper";
import CopyButton from "@/components/CopyButton";
import Link from "next/link";

const Certificate = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  const { formatDate } = useHelper();
  const response = await fetch(`${backend}/api/certificates/${params.id}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });
  if (response.status == 200) {
    const certificate = (await response.json()) as CertificateDTO;
    const baseURL = `/certificates/${params.id}`;
    return (
      <div className="flex flex-col">
        <h1>Certificate {certificate.name}</h1>
        {session?.roles?.includes(adminRole) && (
          <div className="flex flex-row justify-around card w-full bg-base-100 shadow-xl mt-8 px-4 py-2">
            {certificate.state === CertificateState.CREATION && (
              <>
                <Link
                  href={`${baseURL}/upload-signed`}
                  className="btn btn-info text-white font-semibold"
                >
                  Upload signed Certificate
                </Link>
                <Link
                  href={`${baseURL}/sign`}
                  className="btn btn-info text-white font-semibold"
                >
                  Sign the Certificate
                </Link>
              </>
            )}
            {certificate.state === CertificateState.DISTRIBUTION && (
              <Link
                href={`${baseURL}/deploy-aws`}
                className="btn btn-info text-white font-semibold"
              >
                Deploy to AWS
              </Link>
            )}
            {certificate.state !== CertificateState.CREATION && (
              <Link
                href={`${baseURL}/renew`}
                className="btn btn-warning text-white font-semibold"
              >
                Renew Certificate
              </Link>
            )}
            {certificate.state !== CertificateState.REVOCATION && (
              <Link
                href={`${baseURL}/revoke`}
                className="btn btn-error text-white font-semibold"
              >
                Revoke Certificate
              </Link>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">General</h2>
              <label className="label">
                <span className="label-text">Name</span>
                <span className="select-all">{certificate.name}</span>
              </label>
              <label className="label">
                <span className="label-text">State</span>
                <span className="select-all">{certificate.state}</span>
              </label>
              <label className="label text-ellipsis overflow-hidden">
                <span className="label-text">Serial Number</span>
                <span className="text-wrap select-all">
                  {certificate.serialNumber}
                </span>
              </label>
              <label className="label text-ellipsis overflow-hidden">
                <span className="label-text">SHA-1 Fingerprint</span>
                <span className="text-wrap select-all">
                  {certificate.sha1Fingerprint}
                </span>
              </label>
              <label className="label text-ellipsis overflow-hidden">
                <span className="label-text">SHA-256 Fingerprint</span>
                <span className="text-wrap select-all">
                  {certificate.sha256Fingerprint}
                </span>
              </label>
              <label className="label">
                <span className="label-text">Valid from</span>
                <span className="text-wrap select-all">
                  {formatDate(certificate.validFrom)}
                </span>
              </label>
              <label className="label">
                <span className="label-text">Valid until</span>
                <span className="text-wrap select-all">
                  {formatDate(certificate.validUntil)}
                </span>
              </label>
              <label className="label">
                <span className="label-text">Type</span>
                <span className="text-wrap select-all">
                  {certificate.certificateAuthority
                    ? "Certificate Authority"
                    : "Leaf Certificate"}
                </span>
              </label>
            </div>
          </div>

          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Key</h2>
              <label className="label">
                <span className="label-text">Size</span>
                <span className="select-all">{certificate.key?.size}</span>
              </label>
              <label className="label">
                <span className="label-text">Algorithm</span>
                <span className="select-all">{certificate.key?.algorithm}</span>
              </label>
              <label className="label">
                <span className="label-text">Secret Engine</span>
                <span className="select-all">
                  {certificate.key?.secretEngine}
                </span>
              </label>
              {!!certificate.key?.modulus && (
                <label className="label text-ellipsis overflow-hidden">
                  <span className="label-text">Modulus</span>
                  <span className="select-all">{certificate.key?.modulus}</span>
                </label>
              )}
            </div>
          </div>

          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Distinguished Name (Subject)</h2>
              <label className="label">
                <span className="label-text">commonName</span>
                <span className="select-all">
                  {certificate.subject.commonName}
                </span>
              </label>
              <label className="label">
                <span className="label-text">organization</span>
                <span className="select-all">
                  {certificate.subject.organization}
                </span>
              </label>
              <label className="label">
                <span className="label-text">organizationUnit</span>
                <span className="select-all">
                  {certificate.subject.organizationUnit}
                </span>
              </label>
              <label className="label">
                <span className="label-text">locality</span>
                <span className="select-all">
                  {certificate.subject.locality}
                </span>
              </label>
              <label className="label">
                <span className="label-text">state</span>
                <span className="select-all">{certificate.subject.state}</span>
              </label>
              <label className="label">
                <span className="label-text">country</span>
                <span className="select-all">
                  {certificate.subject.country}
                </span>
              </label>
            </div>
          </div>

          {certificate.state !== CertificateState.CREATION && (
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Distinguished Name (Issuer)</h2>
                <label className="label">
                  <span className="label-text">commonName</span>
                  <span className="select-all">
                    {certificate.issuer?.commonName}
                  </span>
                </label>
                <label className="label">
                  <span className="label-text">organization</span>
                  <span className="select-all">
                    {certificate.issuer?.organization}
                  </span>
                </label>
                <label className="label">
                  <span className="label-text">organizationUnit</span>
                  <span className="select-all">
                    {certificate.issuer?.organizationUnit}
                  </span>
                </label>
                <label className="label">
                  <span className="label-text">locality</span>
                  <span className="select-all">
                    {certificate.issuer?.locality}
                  </span>
                </label>
                <label className="label">
                  <span className="label-text">state</span>
                  <span className="select-all">
                    {certificate.issuer?.state}
                  </span>
                </label>
                <label className="label">
                  <span className="label-text">country</span>
                  <span className="select-all">
                    {certificate.issuer?.country}
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Subject Alternative Name</h2>
              {!certificate.subjectAlternativeNames.length ? (
                <p>No Subject Alternative Names were added.</p>
              ) : (
                <>
                  {certificate.subjectAlternativeNames.map((entry, index) => (
                    <label key={index} className="label">
                      <span className="label-text">{entry.type}</span>
                      <span className="select-all">{entry.value}</span>
                    </label>
                  ))}
                </>
              )}
            </div>
          </div>

          {certificate.csr && (
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">CSR</h2>
                <textarea
                  className="textarea min-h-52"
                  value={certificate.csr}
                  disabled
                ></textarea>
                <CopyButton value={certificate.csr}>Copy CSR</CopyButton>
              </div>
            </div>
          )}

          {certificate.state !== CertificateState.CREATION &&
            !!certificate.awsDeployments && (
              <div className="card w-full bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">AWS Deployments</h2>
                  {certificate.awsDeployments.map((entry, index) => (
                    <div
                      key={index}
                      className="card w-full bg-slate-300 text-white font-semibold shadow-xl px-4 py-2 text-ellipsis overflow-hidden select-all"
                    >
                      <p>{`${formatDate(entry.execution)}: ${
                        entry.certificateArn
                      }`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
};

export default Certificate;
