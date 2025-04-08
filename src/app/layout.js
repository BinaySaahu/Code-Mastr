"use client";

import "./globals.css";
import NavBar from "@/custom-components/NavBar";
import { Provider } from "react-redux";
import store from "./data-store/store";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/assets/logo-transparent.png";

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <head>
          <link rel="icon" href="logo-transparent.png" type="image/png" />
          <title>Code master</title>
        </head>
        <body className="dark">
          {" "}
          {/* You can conditionally add "dark" class here based on user preference */}
          <SessionProvider>
            <NavBar />
            {children}
            <Toaster />
          </SessionProvider>
        </body>
      </html>
    </Provider>
  );
}
