"use client";

import "./globals.css";
import NavBar from "@/custom-components/NavBar";
import { Provider } from "react-redux";
import store from "./data-store/store";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <html lang="en">
          <head>
            <title>Code mastr</title>
          </head>
          <body className={`dark`}>
            <NavBar />
            {children}
            <Toaster/>
          </body>
        </html>
      </Provider>
    </SessionProvider>
  );
}
