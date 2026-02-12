import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SimpleTableProps<T = any> = {
  headers: string[];
  rows: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
};

export function DataTable<T>({
  headers,
  rows,
  renderRow,
}: SimpleTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="!bg-[#F5F5F5]">
          <TableRow>
            {headers.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody >
          {rows?.map((row, index) => renderRow(row, index))}
        </TableBody>
      </Table>
    </div>
  );
}
