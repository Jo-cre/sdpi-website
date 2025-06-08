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
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "./ui/button";
import { Chart } from "./chart";

export function TokenCard() {
  const [apiData, setApiData] = useState<[] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const t = useTranslations("tokenCard");
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
        `${process.env.NEXT_PUBLIC_API_URL}/readings?token=${token}`
      );
      if (!response.ok) throw new Error("Erro ao buscar dados");
      const data = await response.json();
      setApiData(data);
    } catch (e) {
      // handle error if needed
    }
  }, [token]);

  useEffect(() => {
    if (apiData && apiData.length > 0 && token) {
      const interval = setInterval(() => {
        console.log("Atualizando dados do gráfico...");
        refetchData();
      }, 10 * 1000); // 30 segundos
      return () => clearInterval(interval);
    }
  }, [apiData, token, refetchData]);

  // Função para receber dados e token do TokenForm
  function handleFormSuccess(data: any, tokenValue: string) {
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
            ? t("chart.title")
            : t("title")}
        </CardTitle>
        <CardDescription className="m-auto">
          {loading
            ? ""
            : apiData && apiData.length > 0
            ? t("chart.desc")
            : t("desc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {apiData ? (
          <div className="text-center">
            <pre className=" p-2 rounded text-sm max-w-full overflow-x-auto text-left">
              <Chart
                data={apiData
                  .slice()
                  .sort(
                    (a: { date_time: string }, b: { date_time: string }) =>
                      new Date(a.date_time).getTime() -
                      new Date(b.date_time).getTime()
                  )}
              />
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
                className="absolute inset-0 flex items-center justify-center z-10 bg-card"
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
