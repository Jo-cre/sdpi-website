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

export function TokenCard() {
  const t = useTranslations("tokenCard");

  return (
    <Card className="w-1/4">
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
