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
import useMediaQuery from "@/hooks/useMediaQuery";

export function TokenForm() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const t = useTranslations("tokenForm");
  var t2 = useTranslations("tokenCard");

  const FormSchema = z.object({
    token: z.string().min(2, {
      message: t("error"),
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      token: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { token } = data;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/readings?token=${token}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if ((data = [])) console.error("No data found");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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
              {isMobile && <FormDescription>{t2("desc")}</FormDescription>}
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
