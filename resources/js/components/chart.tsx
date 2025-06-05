"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import React from "react"

export const description = "An area chart with gradient fill"

export type DataPoint = {
  time: string,
  value: number
}
type RealtimeProps = {
  title: string,
  desc: string,
  className?: string,
  data: DataPoint[],
  label: string,
  dataKey: string,
  reponsiveClass?: string
}


export const RealTimeChart: React.FC<RealtimeProps> = ({ title, desc, className, reponsiveClass, data, label, dataKey }) => {


  return (
    <div className={`bg-sky-50 ${className} shadow-0 py-5 rounded-4xl  border-0`}>
      <CardHeader>
        <CardTitle className="">{title}</CardTitle>
        <CardDescription className="text-zinc-300">
          {desc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{}}
          reponsiveClass={reponsiveClass}
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis className="text-slate-100" 
            stroke="0"
            />
            <XAxis
              dataKey={"time"}
              color="white"
              tick={{ fill: "white" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              stroke="0"
              className="text-xs"
              
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
      
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#739dd2"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#7788a9"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey={dataKey || "value"}
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="#7788a9"
              stackId="a"
              strokeWidth={2}
            />

          </AreaChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}