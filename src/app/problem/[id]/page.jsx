import CodeEditor from "@/custom-components/CodeEditor";
import TestCases from "@/custom-components/TestCases";
import React from "react";

const page = ({ params }) => {
  const testCases = [
    {
      input: "2 3",
      output: "5",
    },
    {
      input: "5 1",
      output: "6",
    },
    {
      input: "4 3",
      output: "7",
    },
  ];
  const contraints = ["1 <= A <= 1000", "1 <= B <= 1000"];
  return (
    <div className="w-full px-5 h-screen flex">
      {/* problem statement */}
      <div className="w-1/2 h-screen overflow-scroll py-5 pt-20 px-2">
        <h2 className="font-bold text-3xl">Two sum</h2>
        <p className="mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, quae
          hic. Porro vel labore perferendis. Totam nihil aspernatur eius quasi.
        </p>
        <div className="py-5 flex flex-col gap-5">
          <h3 className="font-bold text-2xl">Testcases</h3>
          {testCases.map((testCase, index) => (
            <div key={index} className={`w-11/12 ${index < 2 ? "block":"hidden"}`}>
              <p className="font-bold text-lg">Input</p>
              <div className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2">
                {testCase.input}
              </div>
              <p className="font-bold text-lg mt-3">Output</p>
              <div className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2">
                {testCase.output}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <p className="font-bold text-2xl">Contraints</p>
          <ol className=" list-disc">
            {contraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ol>
        </div>
      </div>
      {/* code editor */}
      <div className="w-1/2 h-screen overflow-scroll py-5 pt-20">
        <CodeEditor />
        <TestCases testCases={testCases} />
      </div>
    </div>
  );
};

export default page;
