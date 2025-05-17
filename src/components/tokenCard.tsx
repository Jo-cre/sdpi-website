"use client;";

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
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const t = useTranslations("tokenCard");
  const width = isTablet ? "50%" : "25%";

  return (
    <Card style={{ width }}>
      <CardHeader>
        <CardTitle className="m-auto">{t("title")}</CardTitle>
        <CardDescription className="m-auto">{t("desc")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <TokenForm />
      </CardContent>
    </Card>
  );
}
