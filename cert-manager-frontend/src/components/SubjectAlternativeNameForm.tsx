"use client";
import { SubjectAlternativeName } from "@/types/dto";
import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

type SubAltNameEntry = {
  id: number;
  subjectAlternativeName: SubjectAlternativeName;
};

const SubjectAlternativeNameForm = ({ subjectAlternativeNames }: { subjectAlternativeNames?:  SubjectAlternativeName[]}) => {
  const [counter, setCounter] = useState(subjectAlternativeNames?.length ?? 0)
  const [subAltNames, setSubAltNames] = useState<SubAltNameEntry[]>(subjectAlternativeNames?.map((entry, index) => ({id: index, subjectAlternativeName: entry})) ?? []);
  const [subAltName, setSubAltName] = useState<SubjectAlternativeName>({
    type: "DNS",
    value: "",
  });

  return (
    <>
      <label className="label">
        <span className="label-text">Type</span>
        <select
          className="select select-bordered w-full max-w-xs"
          onChange={(e) =>
            setSubAltName({
              type: e.target.value,
              value: subAltName?.value ?? "",
            })
          }
        >
          <option value="DNS">DNS</option>
          <option value="IP">IP</option>
        </select>
      </label>
      <label className="label">
        <span className="label-text">Value</span>
        <input
          className="input input-bordered w-full max-w-xs"
          type="text"
          value={subAltName?.value ?? ""}
          onChange={(e) =>
            setSubAltName({
              type: subAltName?.type ?? "",
              value: e.target.value,
            })
          }
        />
      </label>

      <button
        className="bg-blue-500 rounded px-4 py-2 text-white font-semibold w-full"
        onClick={(e) => {
          e.preventDefault();
          if (!!subAltName && !!subAltName.type && !!subAltName.value) {
            setSubAltNames([
              ...subAltNames,
              {
                id: counter,
                subjectAlternativeName: subAltName,
              },
            ]);
            setCounter(counter + 1);
          }
        }}
      >
        Add Subject Alternative Name
      </button>

      <div className="flex flex-col space-y-4 items-center">
        {subAltNames.map((entry) => (
          <div
            key={entry.id}
            className="card w-full bg-green-500 text-white font-semibold shadow-xl px-4 py-2 flex flex-row justify-between"
          >
            <p>{`${entry.subjectAlternativeName.type}:${entry.subjectAlternativeName.value}`}</p>
            <TrashIcon
              onClick={() => {
                setSubAltNames(subAltNames.filter((a) => a.id !== entry.id));
              }}
              height="24"
            />
          </div>
        ))}
      </div>

      <input
        type="hidden"
        name="subjectAlternativeName"
        value={JSON.stringify(subAltNames.map(e => e.subjectAlternativeName))}
      />
    </>
  );
};

export default SubjectAlternativeNameForm;
