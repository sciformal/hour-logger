import React from "react";
import { Table } from "react-bootstrap";

// @ts-ignore
export function HourLoggerTable({ headers, rows }) {
  return (
    <Table bordered>
      <thead>
        <tr>
          {
            // @ts-ignore
            headers.map((name) => (
              // @ts-ignore

              <th key={name}>{name}</th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          // @ts-ignore
          rows.map((row, index) => (
            <tr key={index}>
              {
                // @ts-ignore
                row.map((el) => (
                  <td key={`${el}-${index}`}>{el}</td>
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
}
