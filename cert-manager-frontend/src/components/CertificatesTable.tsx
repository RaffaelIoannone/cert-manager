import { CertificateDTO, CertificateState } from "@/types/dto";
import React from "react";
import TableRow from "./TableRow";
import { useHelper } from "@/hook/use-helper";

const CertificatesTable = ({
  certificates,
}: {
  certificates: CertificateDTO[];
}) => {
  const { formatDate } = useHelper();
  return (
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
        {certificates.map((certificate, index) => (
          <TableRow key={certificate.id} id={certificate.id} path="/certificates">
            <td>{index + 1}</td>
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
          </TableRow>
        ))}
      </tbody>
    </table>
  );
};

export default CertificatesTable;
