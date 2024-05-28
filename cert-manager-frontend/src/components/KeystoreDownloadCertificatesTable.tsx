"use client";

import {
  KeystoreEntryDTO,
  KeystoreEntryType,
} from "@/types/dto";
import React, { useState } from "react";
import { useHelper } from "@/hook/use-helper";

const KeystoreDownloadCertificatesTable = ({
  entries,
}: {
  entries: KeystoreEntryDTO[];
}) => {
  const { formatDate } = useHelper();
  const [passwordEntries, setPasswordEntries] = useState(
    new Map<string, string>()
  );
  return (
    <>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2>Certificate Details</h2>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Alias</th>
                <th>Type</th>
                <th>Password</th>
                <th>Name</th>
                <th>Serialnumber & Fingerprint</th>
                <th>Subject</th>
                <th>Validity</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.certificate.id}>
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
                  <td>
                    {entry.type === KeystoreEntryType.ASYMMETRIC_KEY && (
                      <>
                        <label className="label cursor-pointer">
                          <span className="label-text">
                            Same Password as the keystore
                          </span>
                          <input
                            type="checkbox"
                            className="toggle toggle-info"
                            defaultChecked={true}
                            onChange={(e) => {
                              let newMap = new Map(passwordEntries);
                              if (e.target.checked) {
                                newMap.delete(entry.certificate.id);
                              } else {
                                newMap.set(entry.certificate.id, "");
                              }
                              setPasswordEntries(newMap);
                            }}
                          />
                        </label>
                        {passwordEntries.has(entry.certificate.id) && (
                          <input
                            type="password"
                            defaultValue={passwordEntries.get(
                              entry.certificate.id
                            )}
                            autoComplete="off"
                            className="input input-bordered w-full max-w-xs"
                            onChange={(e) => {
                              let newMap = new Map(passwordEntries);
                              newMap.set(entry.certificate.id, e.target.value);
                              setPasswordEntries(newMap);
                            }}
                          />
                        )}
                      </>
                    )}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <input
        type="hidden"
        name="entries"
        value={JSON.stringify(Object.fromEntries(passwordEntries))}
      />
    </>
  );
};

export default KeystoreDownloadCertificatesTable;
