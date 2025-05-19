"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type TokenFormProps = {
  onSuccess: (data: []) => void;
};

export function TokenForm({ onSuccess }: TokenFormProps) {
  const t = useTranslations("tokenForm");

  const FormSchema = z.object({
    token: z.string().min(2, { message: t("error") }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { token: "" },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/readings?token=${data.token}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          form.setError("token", {
            type: "manual",
            message: t("invalid"),
          });
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          form.setError("token", {
            type: "manual",
            message: t("invalid"),
          });
        } else {
          onSuccess(data); // <- avisa ao TokenCard que a API respondeu
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6 flex flex-col items-center justify-center mx-auto"
      >
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col items-center">
              <FormControl>
                <Input placeholder="token" {...field} className="text-center" />
              </FormControl>
              <FormDescription>{t("desc")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t("button")}</Button>
      </form>
    </Form>
  );
}
