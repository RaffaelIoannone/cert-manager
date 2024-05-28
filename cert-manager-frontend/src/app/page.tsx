import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { CertificateDTO } from "@/types/dto";
import { backend } from "@/constants";
import CertificatesTable from "@/components/CertificatesTable";

export default async function Home() {
  const session = await getServerSession(authOptions);
  let certificates: CertificateDTO[] = [];
  if (session) {
    const response = await fetch(`${backend}/api/certificates?expiring=true`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    });
    if (response.status == 200) {
      certificates = (await response.json()) as CertificateDTO[];
    }
  }
  return (
    <div className="overflow-x-auto">
      <h1>Soon expiring Certificates</h1>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <CertificatesTable certificates={certificates} />
        </div>
      </div>
    </div>

  );
}
