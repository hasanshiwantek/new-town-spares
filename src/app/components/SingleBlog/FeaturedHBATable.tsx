import React from "react";

const FeaturedHBATable = () => {
  const tableData = [
    {
      name: "GalaxyTech HBA X200",
      feature1:
        "Improved random access speeds with enhanced data retrieval algorithms. Ideal for high-volume data streams.",
      feature2:
        "Optimized for quick access to frequently used files, reducing latency in data-intensive applications.",
    },
    {
      name: "StellarLink HBA 2024",
      feature1:
        "Balanced performance with both random and sequential access improvements. Great for hybrid workloads.",
      feature2:
        "Seamless integration into existing systems, allowing for straightforward upgrades.",
    },
    {
      name: "HyperDrive HBA 500",
      feature1:
        "Revolutionary architecture maximizing throughput. Perfect for cloud storage solutions.",
      feature2:
        "Supports advanced data integrity checks, ensuring the safety of your information.",
    },
    {
      name: "QuantumCore HBA 900",
      feature1:
        "Ultra-fast read/write capabilities with minimal latency. Designed for next-gen data centers.",
      feature2:
        "Features advanced cooling technology to maintain peak performance under heavy loads.",
    },
    {
      name: "TitanData HBA 3000",
      feature1:
        "Exceptional performance in both random and sequential tasks. Tailored for enterprise-level applications.",
      feature2:
        "Energy-efficient design helps reduce operational costs over time.",
    },
  ];

  return (
    <section className="w-full ">
      <div className="overflow-x-auto border border-gray-200 rounded-md bg-white">
        <table className="w-full border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th colSpan={3} className="text-left py-4 px-6 h3-secondary">
                Featured HBA Solutions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {tableData.map((item, index) => (
              <tr
                key={index}
                className="border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="py-5 px-6 h4-medium  border align-top w-[25%]">
                  {item.name}
                </td>
                <td className="py-5 px-6 h4-regular border align-top w-[37.5%]">
                  {item.feature1}
                </td>
                <td className="py-5 px-6 h4-regular border align-top w-[37.5%]">
                  {item.feature2}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default FeaturedHBATable;
