"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const locales = [
  { code: "en", label: "English" },
  { code: "pt-br", label: "Português" },
  { code: "es", label: "Español" },
];

export function LocaleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLocaleChange = (locale: string) => {
    // Replace the current locale in the pathname with the new one
    const segments = pathname.split("/");
    segments[1] = locale;
    router.replace(segments.join("/"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default">
          <span className="capitalize">{currentLocale}</span>
          <span className="sr-only">Toggle locale</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            disabled={locale.code === currentLocale}
          >
            {locale.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
