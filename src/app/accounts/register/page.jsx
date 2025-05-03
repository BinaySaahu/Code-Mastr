"use client";
import isNotAuth from "@/custom-components/utils/isNotAuth";
import SignupModal from "@/custom-components/SignupModal";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    document.title = "Register";
  }, []);
  return (
    <div>
      <SignupModal />
    </div>
  );
};

export default isNotAuth(page);
