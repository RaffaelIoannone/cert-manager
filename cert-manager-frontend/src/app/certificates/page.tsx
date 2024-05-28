import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { backend } from "@/constants";
import { CertificateDTO } from "@/types/dto";
import CertificatesTable from "@/components/CertificatesTable";

const Certificates = async () => {
  const session = await getServerSession(authOptions);
  let certificates: CertificateDTO[] = [];
  const response = await fetch(`${backend}/api/certificates`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });
  if (response.status == 200) {
    certificates = (await response.json()) as CertificateDTO[];
  }

  return (
    <div className="overflow-x-auto">
      <h1>Certificates</h1>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <CertificatesTable certificates={certificates} />
        </div>
      </div>
    </div>
  );
};

export default Certificates;
