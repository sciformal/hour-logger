import React from "react";
import { Table } from "react-bootstrap";

export function HourLoggerTable({ headers, rows }) {
  return (
    <Table bordered>
      <thead>
        <tr>
          {headers.map((name) => (
            <th key={name}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((el) => (
              <td key={`${el}-${index}`}>{el}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
