"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { TokenForm } from "./tokenForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "./ui/button";
import { Chart } from "./chart";

type Device = {
  id: number;
  token: string;
  read: Reading[];
  createdAt: string;
  name: string;
};

type Reading = {
  id: string;
  temperature: number;
  humidity: number;
  date_time: string;
  deviceId: number;
  device: Device;
};

export function TokenCard() {
  const [apiData, setApiData] = useState<Device[] | null>(null);
  const [chartData, setChartData] = useState<[] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [dId, setDId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const t = useTranslations("tokenCard");
  const t2 = useTranslations("devices");
  const width = isMobile ? "90%" : isTablet ? "50%" : "25%";

  function handleReset() {
    setApiData(null);
    setToken(null);
    setFormKey((k) => k + 1);
  }

  const refetchData = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/devices?token=${token}`
      );
      if (!response.ok) throw new Error("Error fetching data");
      const data = await response.json();
      setApiData(data);
      console.log(data);
    } catch (e) {
      throw new Error("Error: " + e);
    }
  }, [token]);

  const fetchChartData = useCallback(async (id: number) => {
    console.log(id);

    if (!id) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/readings?id=${id}`
      );
      if (!response.ok) throw new Error("Error fetching reading data");
      const data = await response.json();
      setChartData(data);
      console.log(data);
    } catch (e) {
      throw new Error("Error: " + e);
    }
  }, []);

  useEffect(() => {
    if (apiData && apiData.length > 0 && token) {
      const interval = setInterval(() => {
        console.log("Updating data...");
        refetchData();
      }, 20 * 1000); // 60 segundos
      return () => clearInterval(interval);
    }
  }, [apiData, token, refetchData]);

  useEffect(() => {
    if (chartData && chartData.length > 0 && dId) {
      const interval = setInterval(() => {
        console.log("Updating chart data...");
        fetchChartData(dId);
      }, 10 * 1000); // 30 segundos
      return () => clearInterval(interval);
    }
  }, [chartData, dId, fetchChartData]);

  // Função para receber dados e token do TokenForm
  function handleFormSuccess(data: [], tokenValue: string) {
    setApiData(data);
    setToken(tokenValue);
  }

  return (
    <Card style={{ minWidth: width }}>
      <CardHeader>
        <CardTitle className="m-auto">
          {loading
            ? t("load")
            : apiData && apiData.length > 0
            ? t2("title")
            : t("title")}
        </CardTitle>
        <CardDescription className="m-auto">
          {loading
            ? ""
            : apiData && apiData.length > 0
            ? t2("desc")
            : t("desc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {apiData ? (
          <div className="text-center">
            <pre className=" p-2 rounded text-sm max-w-full overflow-x-auto text-left">
              <ScrollArea className="h-[200px] w-[350px]">
                {apiData.map((device) => (
                  <Dialog key={"dialog " + device.id}>
                    <DialogTrigger
                      className="hover:hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50
                        w-full text-start h-9 px-4 py-2 has-[>svg]:px-3"
                      onClick={() => {
                        setChartData(null);
                        setDId(device.id);
                        fetchChartData(device.id);
                      }}
                    >
                      {device.name}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          {t("chart.title")}
                        </DialogTitle>
                        <DialogDescription className="text-center">
                          {t("chart.desc")}
                        </DialogDescription>
                        {chartData ? (
                          <Chart
                            data={chartData
                              .slice()
                              .sort(
                                (
                                  a: { date_time: string },
                                  b: { date_time: string }
                                ) =>
                                  new Date(a.date_time).getTime() -
                                  new Date(b.date_time).getTime()
                              )}
                          />
                        ) : (
                          <div
                            className="inset-0 flex items-center justify-center z-10 bg-dialog"
                            style={{ minHeight: 120 }}
                          >
                            <span className="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                          </div>
                        )}
                      </DialogHeader>
                    </DialogContent>
                    <Separator />
                  </Dialog>
                ))}
              </ScrollArea>
            </pre>
            <Button className="mt-auto" type="button" onClick={handleReset}>
              {t("back")}
            </Button>
          </div>
        ) : (
          <div className="relative w-full">
            <TokenForm
              key={formKey}
              onSuccess={handleFormSuccess}
              onLoading={setLoading}
            />
            {loading && (
              <div
                className="absolute h-[105%] m-auto inset-0 flex items-center justify-center z-10 bg-card"
                style={{ minHeight: 120 }}
              >
                <span className="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
