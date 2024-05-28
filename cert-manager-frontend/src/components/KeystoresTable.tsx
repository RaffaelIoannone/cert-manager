import { KeystoreDTO } from "@/types/dto";
import React from "react";
import TableRow from "./TableRow";

const KeystoresTable = ({
  keystores,
}: {
  keystores: KeystoreDTO[];
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Description</th>
          <th>Number of entries</th>
        </tr>
      </thead>
      <tbody>
        {keystores.map((keystore, index) => (
          <TableRow key={keystore.id} id={keystore.id} path="/keystores">
            <td>{index + 1}</td>
            <td>{keystore.name}</td>
            <td className="text-ellipsis overflow-hidden">{keystore.description}</td>
            <td>{keystore.entries.length}</td>
          </TableRow>
        ))}
      </tbody>
    </table>
  );
};

export default KeystoresTable;
