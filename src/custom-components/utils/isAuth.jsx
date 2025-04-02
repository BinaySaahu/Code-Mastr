"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function isAuth(Component) {
//   const USER = useSelector((state) => state.user);
  return function IsAuth(props) {
    const auth = localStorage.getItem("token");

    useEffect(() => {
      if (!auth) {
        return redirect("/accounts/login");
      }
    }, []);

    if (!auth) {
      return null;
    }

    return <Component {...props} />;
  };
}
