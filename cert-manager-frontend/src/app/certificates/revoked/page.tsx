import { getServerSession } from "next-auth";
import React from "react";
import { backend } from "@/constants";
import { CertificateDTO } from "@/types/dto";
import CertificatesTable from "@/components/CertificatesTable";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const RevokedCertificates = async () => {
  const session = await getServerSession(authOptions);
  let certificates: CertificateDTO[] = [];
  if (session) {
    const response = await fetch(`${backend}/api/certificates?revoked=true`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    });
    if (response.status == 200) {
      certificates = (await response.json()) as CertificateDTO[];
    }
  }
  return (
    <div className="overflow-x-auto">
      <h1>Revoked Certificates</h1>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <CertificatesTable certificates={certificates} />
        </div>
      </div>
    </div>
  );
};

export default RevokedCertificates;
