import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { backend } from "@/constants";
import { useHelper } from "@/hook/use-helper";
import { CertificateDTO, CertificateState } from "@/types/dto";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const SignCertificate = async ({ params }: { params: { id: string } }) => {
  const signCertificate = async (formData: FormData) => {
    "use server";
    const session = await getServerSession(authOptions);
    const signCertificateDTO = {
      ca: formData.get("ca"),
      notBefore: formData.get("notBefore"),
      notAfter: formData.get("notAfter")
    };
    const response = await fetch(
      `${backend}/api/certificates/${params.id}/sign`,
      {
        method: "PUT",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signCertificateDTO),
      }
    );
    if (response.status == 200) {
      const certificate = (await response.json()) as CertificateDTO;
      redirect(`/certificates/${certificate.id}`);
    }
  };
  const session = await getServerSession(authOptions);
  const { formatDate } = useHelper();

  const addOneYear = (date: Date) => {
    date.setFullYear(date.getFullYear() +1)
    return date
  }
  
  let certificates: CertificateDTO[] = [];
  if (session) {
    const response = await fetch(`${backend}/api/certificates?caonly=true`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    });
    if (response.status == 200) {
      certificates = (await response.json()) as CertificateDTO[];
    }
  }
  return (
    <div>
      <h1>Sign the Certificate</h1>
      <form action={signCertificate}>
        <div className="grid grid-cols-1 gap-4 ">
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2>General</h2>
              <label className="label">
                <span className="label-text">Not before</span>
                <input
                  type="date"
                  name="notBefore"
                  defaultValue={new Date().toISOString().substring(0, 10)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <label className="label">
                <span className="label-text">Not after</span>
                <input
                  type="date"
                  name="notAfter"
                  defaultValue={addOneYear(new Date()).toISOString().substring(0, 10)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
            </div>
          </div>

          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2>How should your certificate be signed?</h2>
              <div className="form-control">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>State</th>
                      <th>Serialnumber & Fingerprint</th>
                      <th>Subject</th>
                      <th>Issuer</th>
                      <th>Validity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      key={params.id}
                      id={params.id}
                      className="hover:bg-zinc-200"
                    >
                      <td>
                        <input
                          type="radio"
                          name="ca"
                          value={params.id}
                          defaultChecked
                        />
                      </td>
                      <td>selfsigned certificate</td>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                    {certificates.map((certificate) => (
                      <tr
                        key={certificate.id}
                        id={certificate.id}
                        className="hover:bg-zinc-200"
                      >
                        <td>
                          <input
                            type="radio"
                            name="ca"
                            value={certificate.id}
                          />
                        </td>
                        <td>{certificate.name}</td>
                        <td>{certificate.state}</td>
                        <td className="min-w-[8rem] max-w-[14rem] text-ellipsis overflow-hidden whitespace-nowrap">
                          {certificate.state !== CertificateState.CREATION && (
                            <>
                              <p>Serial: {certificate.serialNumber} </p>
                              <p>SHA-1: {certificate.sha1Fingerprint} </p>
                              <p>SHA-256: {certificate.sha256Fingerprint}</p>
                            </>
                          )}
                        </td>
                        <td className="min-w-[5rem] max-w-[10rem] text-ellipsis overflow-hidden whitespace-nowrap">
                          <p>
                            {!!certificate.subject.commonName &&
                              `CN: ${certificate.subject.commonName}`}
                          </p>
                          <p>
                            {!!certificate.subject.organization &&
                              `O: ${certificate.subject.organization} `}
                            {!!certificate.subject.organizationUnit &&
                              `OU: ${certificate.subject.organizationUnit}`}
                          </p>
                          <p>
                            {!!certificate.subject.locality &&
                              `L: ${certificate.subject.locality} `}
                            {!!certificate.subject.state &&
                              `ST: ${certificate.subject.state} `}
                            {!!certificate.subject.country &&
                              `C: ${certificate.subject.country}`}
                          </p>
                        </td>
                        <td className="min-w-[5rem] max-w-[10rem] text-ellipsis overflow-hidden whitespace-nowrap">
                          {certificate.state !== CertificateState.CREATION && (
                            <>
                              <p>
                                {!!certificate.issuer?.commonName &&
                                  `CN: ${certificate.issuer.commonName}`}
                              </p>
                              <p>
                                {!!certificate.issuer?.organization &&
                                  `O: ${certificate.issuer.organization} `}
                                {!!certificate.issuer?.organizationUnit &&
                                  `OU: ${certificate.issuer.organizationUnit}`}
                              </p>
                              <p>
                                {!!certificate.issuer?.locality &&
                                  `L: ${certificate.issuer.locality} `}
                                {!!certificate.issuer?.state &&
                                  `ST: ${certificate.issuer.state} `}
                                {!!certificate.issuer?.country &&
                                  `C: ${certificate.issuer.country}`}
                              </p>
                            </>
                          )}
                        </td>
                        <td>
                          {certificate.state != CertificateState.CREATION && (
                            <>
                              <p>{formatDate(certificate.validFrom)}</p>
                              <p>-</p>
                              <p>{formatDate(certificate.validUntil)}</p>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <button className="bg-blue-500 w-full rounded px-8 py-4 mt-7 text-white font-semibold">
          Sign your certificate
        </button>
      </form>
    </div>
  );
};

export default SignCertificate;
