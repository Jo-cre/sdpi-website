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

export function TokenCard() {
  const [apiData, setApiData] = useState<[] | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const t = useTranslations("tokenCard");
  const width = isMobile ? "90%" : isTablet ? "50%" : "25%";

  return (
    <Card style={{ width }}>
      <CardHeader>
        <CardTitle className="m-auto">{t("title")}</CardTitle>
        <CardDescription className="m-auto">{t("desc")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {apiData ? (
          <div className="text-center">
            <pre className=" p-2 rounded text-sm max-w-full overflow-x-auto text-left">
              {JSON.stringify(
                apiData
                  .slice()
                  .sort(
                    (a: { dateTime: string }, b: { dateTime: string }) =>
                      new Date(b.dateTime).getTime() -
                      new Date(a.dateTime).getTime()
                  )[0],
                null,
                2
              )}
            </pre>
          </div>
        ) : (
          <TokenForm onSuccess={setApiData} />
        )}
      </CardContent>
    </Card>
  );
}
