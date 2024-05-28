"use client";
import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

type IntermediateCertificateEntry = {
  id: number;
  certificate: string;
};

let nextID = 0;

const IntermediateCertificateForm = () => {
  const [intermediateCertificates, setIntermediateCertificates] = useState<
    IntermediateCertificateEntry[]
  >([]);
  const [intermediateCertificate, setIntermediateCertificate] =
    useState<string>();
  return (
    <>
      <textarea
        className="textarea min-h-52"
        placeholder="Intermediate Certificate"
        value={intermediateCertificate}
        onChange={(e) => {
          e.preventDefault();
          setIntermediateCertificate(e.target.value);
        }}
      />

      <button
        className="bg-blue-500 rounded px-4 py-2 text-white font-semibold w-full"
        onClick={(e) => {
          e.preventDefault();
          if (!!intermediateCertificate) {
            setIntermediateCertificates([
              ...intermediateCertificates,
              {
                id: nextID++,
                certificate: intermediateCertificate,
              },
            ]);
            setIntermediateCertificate("");
          }
        }}
      >
        Add Intermediate Certificate
      </button>

      <div className="flex flex-col space-y-4 items-center">
        {intermediateCertificates.map((entry) => (
          <div
            key={entry.id}
            className="card w-full bg-slate-100 shadow-xl px-8 py-4 mt-8 flex flex-row justify-around"
          >
            <textarea
              className="textarea min-h-52 w-full"
              value={entry.certificate}
              disabled
            />
            <TrashIcon
              onClick={() => {
                setIntermediateCertificates(
                  intermediateCertificates.filter((a) => a.id !== entry.id)
                );
              }}
              height="24"
            />
          </div>
        ))}
      </div>

      <input
        type="hidden"
        name="intermediateCertificate"
        value={JSON.stringify(
          intermediateCertificates.map((e) => e.certificate)
        )}
      />
    </>
  );
};

export default IntermediateCertificateForm;
