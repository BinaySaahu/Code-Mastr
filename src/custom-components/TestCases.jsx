"use client";
import React, { useState } from "react";

const TestCases = ({ testCases }) => {
  const [tab, setTab] = useState(0);
  const handleTab = (index) => {
    setTab(index);
  };
  return (
    <div className="py-5">
      <h1 className="text-2xl">Test Cases</h1>
      <div className="flex items-center gap-5 my-4">
        {testCases.map((testcase, index) => {
          return (
            <p
              className={`p-3 rounded-md ${tab === index && "bg-[#fff]/[20%]"} ${index < 4 ? "flex":"hidden"} cursor-pointer hover:bg-[#fff]/[10%]`}
              key={index}
              onClick={() => handleTab(index)}
            >
              Test Case {index + 1}
            </p>
          );
        })}
      </div>
      {testCases.map((testCase, index) => (
        <div key={index} className={`${tab === index && index < 4 ? "flex" : "hidden"}`}>
          <div className="w-11/12">
            <p className="font-bold text-lg">Input</p>
            <div className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2">
              {testCase.input}
            </div>
            <p className="font-bold text-lg mt-3">Output</p>
            <div className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2">
              {testCase.output}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestCases;
