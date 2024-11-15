import { AppShell } from "@/client/components/layouts/app-shell";
import { MantineProvider } from "@/client/components/shared/mantine-provider";
import { ColorSchemeScript } from "@mantine/core";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { PropsWithChildren } from "react";

import "@/client/shared/globals.scss";

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Pastebin</title>
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
