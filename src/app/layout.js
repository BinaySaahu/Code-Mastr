"use client"
import "./globals.css";
import NavBar from "@/custom-components/NavBar";
import { Provider } from "react-redux";
import store from "./data-store/store";

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body
          className={`dark`}
        >
          <NavBar/>
          {children}
        </body>
      </html>

    </Provider>
  );
}
