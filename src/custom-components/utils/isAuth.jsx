"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function isAuth(Component) {
  return function IsAuth(props) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false); // Track client-side mount

    useEffect(() => {
      setIsMounted(true); // Set to true after the component is mounted on the client side

      // Only run this logic on the client side
      const auth = localStorage.getItem("token");
      if (!auth) {
        // Redirect to login if no token
        router.push("/accounts/login");
      }
    }, [router]);

    // If the component hasn't mounted yet (SSR), return null to avoid hydration issues
    if (!isMounted) {
      return null; // Or you could return a loading spinner here
    }

    // On client-side, check for auth token
    const auth = localStorage.getItem("token");

    if (!auth) {
      return null; // Optionally, return a loading state or redirect UI if needed
    }

    return <Component {...props} />;
  };
}

export default isAuth;
