"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslations } from "next-intl";

type ChartProps = {
  data: any[];
};

export function Chart({ data }: ChartProps) {
  const t = useTranslations("chart");

  const chartConfig = {
    temperature: {
      label: t("label.temperature"),
      color: "#fb2c36",
    },
    humidity: {
      label: t("label.humidity"),
      color: "#2196f3",
    },
  } satisfies ChartConfig;

  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <AreaChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date_time"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={20}
          tick={{ dy: 10 }}
          tickFormatter={(value) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) return value;
            return date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
          }}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="temperature"
          stroke={chartConfig.temperature.color}
          fill={chartConfig.temperature.color}
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="humidity"
          stroke={chartConfig.humidity.color}
          fill={chartConfig.humidity.color}
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
