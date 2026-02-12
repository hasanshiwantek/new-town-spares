// components/DataColumn.tsx
import React from "react";

type DataColumnProps = {
  title: string;
  items: React.ReactNode[];
  className?: string;
};

const DataColumn: React.FC<DataColumnProps> = ({ title, items, className }) => {
  return (
    <div className={` w-full border rounded-md border-[#DDEBF5] ${className}`}>
      <div className="bg-[#F5F5F5] text-[#3A3A3A]  font-semibold text-lg px-2 py-2 rounded-t-md border border-b-0 whitespace-nowrap">
        {title}
      </div>
      <div className="border rounded-b-md divide-[#DDEBF5] divide-y text-lg whitespace-nowrap">
        {items.map((item, i) => (
          <div key={i} className="px-4 py-2 text-gray-900 ">
            {item || "-"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataColumn;
