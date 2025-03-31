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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProblemStatementSkeleton from "@/custom-components/ProblemStatementSkeleton";
import CodeEditorSkeleton from "@/custom-components/CodeEditorSkeleton";
import TestCasesSkeleton from "@/custom-components/TestCasesSkeleton";
import RuntimeError from "@/custom-components/RuntimeError";
import CompileTimeError from "@/custom-components/CompileTimeError";
import Submissions from "@/custom-components/pages/problem/Submissions";
import ProblemStatement from "@/custom-components/pages/problem/ProblemStatement";
import { useSelector } from "react-redux";
import ProblemListSkeleton from "@/custom-components/ProblemListSkeleton";

const page = ({ params }) => {
  const [problemData, setProblemData] = useState();
  const [language, setLanguage] = useState();
  const [code, setCode] = useState();
  const [executionStatus, setExecutionStatus] = useState(9);
  const [output, setOutput] = useState("processing");
  const [passedTestCases, setPassedTestCases] = useState();
  const [submissions, setSubmissions] = useState(null);
  const [loading, setLoading] = useState(false);
  const USER = useSelector((state) => state.user);

  const loadProblem = async () => {
    setLoading(true);
    const par = await params;
    try {
      const response = await fetch(`/api/get-problem?id=${par.id}&userId=${USER.userId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Error in fetching problem");
      }
      console.log("data->", data.problem);
      setProblemData(data.problem);
      setLanguage(data.problem.languages[0]);
      setCode(data.problem.languages[0].boilerplateCode);
      setSubmissions(data.submissions)
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast(error.message);
      setLoading(false)
    }
  };

  const getTestCases = () => {
    if (
      executionStatus === 1 ||
      executionStatus === 2 ||
      executionStatus === 9
    ) {
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
  }, [USER]);
  return (
    <div className="w-full px-5 h-screen flex">
      {/* problem statement */}
      <div className="w-1/2 h-screen overflow-scroll py-5 pt-20 px-2">
        {!problemData ? (
          <ProblemStatementSkeleton />
        ) : (
          <div className="w-full">
            <Tabs defaultValue="problem" className="w-full pb-5">
              <TabsList>
                <TabsTrigger value="problem">Problem</TabsTrigger>
                <TabsTrigger value="submission">Submissions</TabsTrigger>
              </TabsList>
              <TabsContent value="problem" className = "w-full">
                <ProblemStatement problemData = {problemData}/>
                
              </TabsContent>
              <TabsContent value="submission">
                {!problemData ? <ProblemListSkeleton/>:(problemData.submissions.length === 0 ?<p className="text-white">No submissions yet</p> :<Submissions submissions = {problemData.submissions}/>)}
              </TabsContent>
            </Tabs>
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
            executionStatus={executionStatus}
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
