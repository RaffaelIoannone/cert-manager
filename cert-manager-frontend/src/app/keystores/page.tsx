import { KeystoreDTO } from '@/types/dto';
import { getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import { backend } from '@/constants';
import KeystoresTable from '@/components/KeystoresTable';

const Keystores = async () => {
  const session = await getServerSession(authOptions);
  let keystores: KeystoreDTO[] = [];
  const response = await fetch(`${backend}/api/keystores`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });
  if (response.status == 200) {
    keystores = (await response.json()) as KeystoreDTO[];
  }

  return (
    <div className="overflow-x-auto">
      <h1>Keystores</h1>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <KeystoresTable keystores={keystores} />
        </div>
      </div>
    </div>
  )
}

export default Keystores