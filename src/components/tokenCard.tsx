"use client";

import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const t = useTranslations("tokenCard");
  const width = isMobile ? "90%" : isTablet ? "50%" : "25%";

  function handleReset() {
    setApiData(null);
    setFormKey((k) => k + 1);
  }

  return (
    <Card style={{ minWidth: width }}>
      <CardHeader>
        <CardTitle className="m-auto">
          {loading
            ? t("load")
            : apiData && apiData.length > 0
            ? "ㅤㅤ"
            : t("title")}
        </CardTitle>
        <CardDescription className="m-auto">
          {loading ? "" : apiData && apiData.length > 0 ? "" : t("desc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {apiData ? (
          <div className="text-center relative">
            <pre className=" p-2 rounded text-sm max-w-full overflow-x-auto text-left">
              <Chart
                data={apiData
                  .slice()
                  .sort(
                    (a: { dateTime: string }, b: { dateTime: string }) =>
                      new Date(b.dateTime).getTime() -
                      new Date(a.dateTime).getTime()
                  )}
              />
            </pre>
            <Button
              className="absolute right-0 bottom-0"
              type="button"
              onClick={handleReset}
            >
              {t("back")}
            </Button>
          </div>
        ) : (
          <div className="relative w-full">
            <TokenForm
              key={formKey}
              onSuccess={setApiData}
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
