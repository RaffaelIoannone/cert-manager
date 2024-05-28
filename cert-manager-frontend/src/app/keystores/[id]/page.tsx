import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminRole, backend } from "@/constants";
import { getServerSession } from "next-auth";
import React from "react";
import { KeystoreDTO, KeystoreEntryType } from "@/types/dto";
import { useHelper } from "@/hook/use-helper";
import Link from "next/link";
import TableRow from "@/components/TableRow";

const Keystore = async ({ params }: { params: { id: string } }) => {
  const { formatDate } = useHelper();
  const session = await getServerSession(authOptions);
  const response = await fetch(`${backend}/api/keystores/${params.id}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });
  if (response.status == 200) {
    const keystore = (await response.json()) as KeystoreDTO;
    const baseURL = `/keystores/${params.id}`;
    return (
      <div className="flex flex-col">
        <h1>Keystore {keystore.name}</h1>
        {session?.roles?.includes(adminRole) && (
          <div className="flex flex-row justify-around card w-full bg-base-100 shadow-xl mt-8 px-4 py-2">
            <Link
              href={`${baseURL}/download`}
              className="btn btn-info text-white font-semibold"
            >
              Download Keystore
            </Link>

            <Link
              href={`${baseURL}/delete`}
              className="btn btn-error text-white font-semibold"
            >
              Delete Keystore
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 mt-8">
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">General</h2>
              <label className="label">
                <span className="label-text">Name</span>
                <span className="select-all">{keystore.name}</span>
              </label>
              <label className="label flex-col items-start">
                <span className="label-text">Description</span>
                <textarea
                  className="textarea min-h-52 w-full"
                  value={keystore.description}
                  disabled
                ></textarea>
              </label>
            </div>
          </div>

          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Certificates</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Alias</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Serialnumber & Fingerprint</th>
                    <th>Subject</th>
                    <th>Validity</th>
                  </tr>
                </thead>
                <tbody>
                  {keystore.entries.map((entry, index) => (
                    <TableRow
                      key={entry.certificate.id}
                      id={entry.certificate.id}
                      path="/certificates"
                    >
                      <td>{index + 1}</td>
                      <td>{entry.alias}</td>
                      <td>
                        {entry.type === KeystoreEntryType.ASYMMETRIC_KEY && (
                          <>
                            {entry.includeRootCA
                              ? "Keypair (Root CA included)"
                              : "Keypair (Root CA not included)"}
                          </>
                        )}
                        {entry.type === KeystoreEntryType.TRUSTED_CERTIFICATE &&
                          "Trustentry"}
                      </td>
                      <td>{entry.certificate.name}</td>
                      <td className="min-w-[8rem] max-w-[14rem] text-ellipsis overflow-hidden whitespace-nowrap">
                        <p>Serial: {entry.certificate.serialNumber} </p>
                        <p>SHA-1: {entry.certificate.sha1Fingerprint} </p>
                        <p>SHA-256: {entry.certificate.sha256Fingerprint}</p>
                      </td>
                      <td className="min-w-[5rem] max-w-[10rem] text-ellipsis overflow-hidden whitespace-nowrap">
                        <p>
                          {!!entry.certificate.subject.commonName &&
                            `CN: ${entry.certificate.subject.commonName}`}
                        </p>
                        <p>
                          {!!entry.certificate.subject.organization &&
                            `O: ${entry.certificate.subject.organization} `}
                          {!!entry.certificate.subject.organizationUnit &&
                            `OU: ${entry.certificate.subject.organizationUnit}`}
                        </p>
                        <p>
                          {!!entry.certificate.subject.locality &&
                            `L: ${entry.certificate.subject.locality} `}
                          {!!entry.certificate.subject.state &&
                            `ST: ${entry.certificate.subject.state} `}
                          {!!entry.certificate.subject.country &&
                            `C: ${entry.certificate.subject.country}`}
                        </p>
                      </td>
                      <td>
                        <p>{formatDate(entry.certificate.validFrom)}</p>
                        <p>-</p>
                        <p>{formatDate(entry.certificate.validUntil)}</p>
                      </td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Keystore;
