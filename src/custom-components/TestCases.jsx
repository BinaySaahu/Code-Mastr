"use client";
import React, { useState } from "react";

const TestCases = ({ testCases, output, passedTestCases }) => {
  const [tab, setTab] = useState(0);
  const handleTab = (index) => {
    setTab(index);
    console.log(passedTestCases)
  };
  return (
    <div className="py-5">
      {output && (
        <div className="text-2xl font-bold">
          {output === "Accepted" ? (
            <p className="text-green-500">Accepted</p>
          ) : (
            output === "processing"? <h1 className="text-2xl font-bold">Test Cases</h1> :
            <p className="text-red-500">Wrong Answer</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-5 my-4">
        {testCases.map((testcase, index) => {
          return (
            <p
              className={`p-3 rounded-md ${
                tab === index && "bg-[#fff]/[20%]"
              } ${
                passedTestCases &&
                (passedTestCases[index].status == "acc"
                  ? "text-green-500"
                  : "text-red-600")
              } ${
                !passedTestCases && "text-white"
              } cursor-pointer hover:bg-[#fff]/[10%] font-bold`}
              key={index}
              onClick={() => handleTab(index)}
            >
              Test Case {index + 1}
            </p>
          );
        })}
      </div>
      {testCases.map((testCase, index) => {
        const inp = testCase.input.replace("\n", "<br>");
        const out = testCase.output.replace("\n", "<br>");
        return (
          <div key={index} className={`${tab === index ? "flex" : "hidden"}`}>
            <div className="w-11/12">
              <p className="font-bold text-lg">Input</p>
              <div
                className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                dangerouslySetInnerHTML={{ __html: inp }}
              />
              <p className="font-bold text-lg mt-3">Expected Output</p>
              <div
                className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                dangerouslySetInnerHTML={{ __html: out }}
              />
              {
                passedTestCases && (<>
                  <p className="font-bold text-lg mt-3">Your Output</p>
                  <div
                    className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                    dangerouslySetInnerHTML={{ __html: passedTestCases[index].output.replace("\n", "<br>") }}
                  />
                </>)
              }
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TestCases;
