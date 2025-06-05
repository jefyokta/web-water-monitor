import { useEffect, useState } from "react";
import { RealTimeChart, type DataPoint } from "./chart";

type ChartSectionProps = {
  data: DataPoint[];
  reverse?: boolean;
  title: string;
  desc: string;
};

export const ChartSection: React.FC<ChartSectionProps> = ({ data, title, desc, reverse }) => {
  const [currentValue, setCurrentValue] = useState<number>(0)

  useEffect(() => {
    setCurrentValue(data[data.length - 1].value || 0)
  }, [data]);

  return (
    <section
      className={`w-full flex  gap-5 flex-row ${reverse ? "flex-row-reverse" : ""}`}
    >
      <RealTimeChart
        className="flex-1"
        label=""
        data={data}
        dataKey="value"
        title={title}
        desc={""}
        reponsiveClass=""
      />
      <div className="w-1/3 bg-linear-to-b from-[#b3cdfe] to-[#b3cdfe]/50 rounded-4xl p-5 flex flex-col justify-between">
        <h3 className="text-4xl font-semibold">{title}</h3>
        <p className="text-8xl">{currentValue}</p>
        <p className="text-xl text-justify text-neutral-700">{desc}</p></div>
    </section>
  );
};
