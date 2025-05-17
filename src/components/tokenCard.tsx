"use client;";

import { TokenForm } from "./tokenForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function TokenCard() {
  return (
    <Card className="w-1/4">
      <CardHeader>
        <CardTitle className="m-auto">Insert your SDPI token</CardTitle>
        <CardDescription className="m-auto">
          The token was provided upon delivery of the product.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <TokenForm />
      </CardContent>
    </Card>
  );
}
