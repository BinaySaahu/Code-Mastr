"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function isNotAuth(Component) {
//   const USER = useSelector((state) => state.user);
  return function IsNotAuth(props) {
    const auth = localStorage.getItem("token");

    useEffect(() => {
      if (auth) {
        return redirect("/");
      }
    }, []);

    if (auth) {
      return null;
    }

    return <Component {...props} />;
  };
}
