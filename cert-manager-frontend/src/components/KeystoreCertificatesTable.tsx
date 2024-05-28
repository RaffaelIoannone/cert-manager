"use client";

import {
  CertificateDTO,
  KeystoreEntryType,
} from "@/types/dto";
import React, { useState } from "react";
import { useHelper } from "@/hook/use-helper";

type KeystoreEntry = {
  alias: string;
  type: KeystoreEntryType;
  certificate: CertificateDTO;
  includeRootCA: boolean;
};

const KeystoreCertificatesTable = ({
  certificates,
}: {
  certificates: CertificateDTO[];
}) => {
  const { formatDate } = useHelper();
  const [keystoreEntries, setKeystoreEntries] = useState<KeystoreEntry[]>([]);
  return (
    <>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Certificates</h2>
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
              {certificates?.map((certificate) => (
                <tr key={certificate.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      name={certificate.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setKeystoreEntries([
                            ...keystoreEntries,
                            {
                              alias: certificate.name,
                              type: KeystoreEntryType.ASYMMETRIC_KEY,
                              certificate: certificate,
                              includeRootCA: false,
                            },
                          ]);
                        } else {
                          setKeystoreEntries(
                            keystoreEntries.filter(
                              (a) => a.certificate.id !== certificate.id
                            )
                          );
                        }
                      }}
                    />
                  </td>
                  <td>{certificate.name}</td>
                  <td>{certificate.state}</td>
                  <td className="min-w-[8rem] max-w-[14rem] text-ellipsis overflow-hidden whitespace-nowrap">
                    <p>Serial: {certificate.serialNumber} </p>
                    <p>SHA-1: {certificate.sha1Fingerprint} </p>
                    <p>SHA-256: {certificate.sha256Fingerprint}</p>
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
                  </td>
                  <td>
                    <p>{formatDate(certificate.validFrom)}</p>
                    <p>-</p>
                    <p>{formatDate(certificate.validUntil)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {keystoreEntries.length > 0 && (
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Certificate Details</h2>
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Alias</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Serialnumber & Fingerprint</th>
                  <th>Subject</th>
                </tr>
              </thead>
              <tbody>
                {keystoreEntries.map((entry, index) => (
                  <tr key={entry.certificate.id}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        name="alias"
                        defaultValue={entry.alias}
                        className="input input-bordered w-full max-w-xs"
                        onChange={(e) => {
                          let newKeystoreEntries = [...keystoreEntries];
                          newKeystoreEntries[keystoreEntries.indexOf(entry)] = {
                            ...entry,
                            alias: e.target.value,
                          };
                          setKeystoreEntries(newKeystoreEntries);
                        }}
                      />
                    </td>
                    <td>
                      <select
                        className="select select-bordered w-full"
                        defaultValue={entry.type}
                        onChange={(e) => {
                          let newKeystoreEntries = [...keystoreEntries];
                          newKeystoreEntries[keystoreEntries.indexOf(entry)] = {
                            ...entry,
                            type: e.target.value as KeystoreEntryType,
                          };
                          setKeystoreEntries(newKeystoreEntries);
                        }}
                      >
                        <option value="TRUSTED_CERTIFICATE">Trustentry</option>
                        <option value="ASYMMETRIC_KEY">Keypair</option>
                      </select>
                      {entry.type === KeystoreEntryType.ASYMMETRIC_KEY && (
                        <label className="label cursor-pointer">
                          <span className="label-text">Root CA included?</span>
                          <input
                            type="checkbox"
                            className="toggle toggle-info"
                            defaultChecked={entry.includeRootCA}
                            onChange={(e) => {
                              let newKeystoreEntries = [...keystoreEntries];
                              newKeystoreEntries[
                                keystoreEntries.indexOf(entry)
                              ] = {
                                ...entry,
                                includeRootCA: e.target.checked,
                              };
                              setKeystoreEntries(newKeystoreEntries);
                            }}
                          />
                        </label>
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
                  </tr>
                ))}
              </tbody>
            </table>
            <input
              type="hidden"
              name="entries"
              value={JSON.stringify(
                keystoreEntries.map((e) => ({
                  alias: e.alias,
                  type: e.type,
                  certificateId: e.certificate.id,
                  includeRootCA: e.includeRootCA,
                }))
              )}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default KeystoreCertificatesTable;
