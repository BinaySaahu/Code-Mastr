"use client";
import { Badge } from "@/components/ui/badge";
import CodeEditor from "@/custom-components/CodeEditor";
import TestCases from "@/custom-components/TestCases";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ProblemStatementSkeleton from "@/custom-components/ProblemStatementSkeleton";
import CodeEditorSkeleton from "@/custom-components/CodeEditorSkeleton";
import TestCasesSkeleton from "@/custom-components/TestCasesSkeleton";
import RuntimeError from "@/custom-components/RuntimeError";
import CompileTimeError from "@/custom-components/CompileTimeError";

const page = ({ params }) => {
  const [problemData, setProblemData] = useState();
  const [language, setLanguage] = useState();
  const [code, setCode] = useState();
  const [executionStatus, setExecutionStatus] = useState(9);
  const [output, setOutput] = useState("processing");
  const [passedTestCases, setPassedTestCases] = useState();

  const loadProblem = async () => {
    const par = await params;
    try {
      const response = await fetch(`/api/get-problem?id=${par.id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Error in fetching problem");
      }
      console.log("data->", data.problem);
      setProblemData(data.problem);
      setLanguage(data.problem.languages[0]);
      setCode(data.problem.languages[0].boilerplateCode);
    } catch (error) {
      console.error(error);
      toast(error.message);
    }
  };

  const getTestCases = () => {
    if (executionStatus === 1 || executionStatus === 2 || executionStatus === 9) {
      return (
        <TestCases
          testCases={problemData?.testcases}
          output={output}
          passedTestCases={passedTestCases}
        />
      );
    } else if (executionStatus === 3) {
      return <RuntimeError err={output} />;
    } else if (executionStatus === 4) {
      return <CompileTimeError err={output} />;
    }
  };

  const runProblem = async () => {
    setExecutionStatus(0);
    const obj = {
      problemId: problemData.id,
      code: code,
      languageId: language.languageId,
      testcases: problemData.testcases,
    };
    console.log(obj);
    try {
      const response = await fetch("/api/submission/run", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.text);
      }
      console.log(json);
      setExecutionStatus(json.code);
      setOutput(json.text);
      setPassedTestCases(json.data);
    } catch (error) {
      console.log(error);
      toast(error);
    }
  };
  const submitProblem = () => {};
  useEffect(() => {
    loadProblem();
  }, []);
  return (
    <div className="w-full px-5 h-screen flex">
      {/* problem statement */}
      <div className="w-1/2 h-screen overflow-scroll py-5 pt-20 px-2">
        {!problemData ? (
          <ProblemStatementSkeleton />
        ) : (
          <div className="w-full">
            <h2 className="font-bold text-3xl">{problemData?.name}</h2>
            <div className="my-5 flex items-center gap-4">
              <Badge variant={problemData?.difficulty}>
                {problemData?.difficulty}
              </Badge>
              <Popover>
                <Badge variant="outline">
                  <PopoverTrigger>Topics</PopoverTrigger>
                </Badge>
                <PopoverContent>
                  {problemData?.topics.map((topic, idx) => {
                    return (
                      <Badge variant="outline" key={idx}>
                        {topic}
                      </Badge>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
            <div
              className="mt-3"
              dangerouslySetInnerHTML={{ __html: problemData?.description }}
            />
          </div>
        )}
      </div>
      {/* code editor */}
      <div className="w-1/2 h-screen overflow-scroll py-5 pt-20">
        {!problemData ? (
          <CodeEditorSkeleton />
        ) : (
          <CodeEditor
            codeSnippets={problemData?.languages}
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            runProblem={runProblem}
            submitProblem={submitProblem}
            executionStatus = {executionStatus}
          />
        )}
        {!problemData || executionStatus === 0 ? (
          <TestCasesSkeleton />
        ) : (
          getTestCases()
        )}
      </div>
    </div>
  );
};

export default page;
