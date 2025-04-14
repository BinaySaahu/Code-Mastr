"use client";
import CodeEditor from "@/custom-components/CodeEditor";
import TestCases from "@/custom-components/TestCases";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Editor } from "@monaco-editor/react";
import SubmissionStatusSkeleton from "@/custom-components/SubmissionStatusSkeleton";

const page = ({ params }) => {
  const [problemData, setProblemData] = useState();
  const [language, setLanguage] = useState();
  const [code, setCode] = useState();
  const [runStatus, setrunStatus] = useState(9);
  const [submitStatus, setSubmitStatus] = useState(9);
  const [submissionOutput, setSubmissionOutput] = useState("processing");
  const [output, setOutput] = useState("processing");
  const [passedTestCases, setPassedTestCases] = useState();
  const [submissions, setSubmissions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("problem");
  const USER = useSelector((state) => state.user);

  const loadProblem = async () => {
    setLoading(true);
    const par = await params;
    try {
      const response = await fetch(
        `/api/get-problem?id=${par.id}&userId=${USER.userId}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Error in fetching problem");
      }
      console.log("data->", data.problem);
      setProblemData(data.problem);
      setLanguage(data.problem.languages[0]);
      setCode(data.problem.languages[0].boilerplateCode);
      setSubmissions(data.submissions);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast(error.message);
      setLoading(false);
    }
  };

  const getTestCases = () => {
    if (
      runStatus === 1 ||
      runStatus === 2 ||
      runStatus === 9 ||
      runStatus === 5
    ) {
      return (
        <TestCases
          testCases={problemData?.testcases}
          output={output}
          passedTestCases={passedTestCases}
          runStatus={runStatus}
        />
      );
    } else if (runStatus === 3) {
      return <RuntimeError err={output} hideHeading={false} />;
    } else if (runStatus === 4) {
      return <CompileTimeError err={output} hideHeading={false} />;
    }
  };

  const getSubmissionStatusHTML = () => {
    switch (submitStatus) {
      case 1:
        return (
          <div className="flex flex-col w-full gap-5">
            <div className="flex items-center gap-5 w-full">
              <h1 className="text-green-500 text-2xl font-bold">
                {submissionOutput.text}
              </h1>
              <p className="text-gray-500 text-base">
                Testcases: {submissionOutput.data.passedTestCasesCnt}/
                {submissionOutput.data.totalTestCases}
              </p>
            </div>
            <div className="rounded-xl flex flex-col gap-3">
              <p className="text-xl font-bold">Code</p>
              <Editor
                height="425px"
                // className="w-full"
                // language="cpp" // Adjust the language based on your code
                value={submissionOutput.data.source_code}
                theme="vs-dark"
                options={{
                  readOnly: true, // Make it read-only
                  minimap: { enabled: false }, // Optional: Disable minimap for better UI
                  wordWrap: "on", // Wrap long lines of code
                  scrollBeyondLastLine: false, // Disable scrolling beyond last line
                  wrappingIndent: "same", // Maintain consistent wrapping indent
                  // automaticLayout: true, // Adjust layout on window resize
                }}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col w-full gap-5">
            <div className="flex items-center gap-5 w-full">
              <h1 className="text-red-500 text-2xl font-bold">
                {submissionOutput.text}
              </h1>
              <p className="text-gray-500 text-base">
                Testcases: {submissionOutput.data.passedTestCasesCnt}/
                {submissionOutput.data.totalTestCases}
              </p>
            </div>
            <div className="flex">
              <div className="w-full">
                <p className="font-bold text-lg">Input</p>
                <div
                  className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                  dangerouslySetInnerHTML={{
                    __html: submissionOutput.data.failedTestCase.input,
                  }}
                />
                <p className="font-bold text-lg mt-3">Expected Output</p>
                <div
                  className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                  dangerouslySetInnerHTML={{
                    __html: submissionOutput.data.failedTestCase.expectedOutput,
                  }}
                />

                <p className="font-bold text-lg mt-3">Your Output</p>
                <div
                  className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                  dangerouslySetInnerHTML={{
                    __html: submissionOutput.data.failedTestCase.output,
                  }}
                />
              </div>
            </div>
            <div className="rounded-xl flex flex-col gap-3">
              <p className="text-xl font-bold">Code</p>
              <Editor
                height="425px"
                // className="w-full"
                // language="cpp" // Adjust the language based on your code
                value={submissionOutput.data.source_code}
                theme="vs-dark"
                options={{
                  readOnly: true, // Make it read-only
                  minimap: { enabled: false }, // Optional: Disable minimap for better UI
                  wordWrap: "on", // Wrap long lines of code
                  scrollBeyondLastLine: false, // Disable scrolling beyond last line
                  wrappingIndent: "same", // Maintain consistent wrapping indent
                  // automaticLayout: true, // Adjust layout on window resize
                }}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col w-full gap-5">
            <div className="flex items-center gap-5 w-full">
              <h1 className="text-red-500 text-2xl font-bold">Runtime Error</h1>
              <p className="text-gray-500 text-base">
                Testcases: {submissionOutput.data.passedTestCasesCnt}/
                {submissionOutput.data.totalTestCases}
              </p>
            </div>
            <RuntimeError err={submissionOutput.text} hideHeading={true} />
            <div className="flex">
              <div className="w-full">
                <p className="font-bold text-lg">Input</p>
                <div
                  className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                  dangerouslySetInnerHTML={{
                    __html: submissionOutput.data.failedTestCase.input,
                  }}
                />
                <p className="font-bold text-lg mt-3">Expected Output</p>
                <div
                  className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                  dangerouslySetInnerHTML={{
                    __html: submissionOutput.data.failedTestCase.expectedOutput,
                  }}
                />

                <p className="font-bold text-lg mt-3">Your Output</p>
                <div
                  className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                  dangerouslySetInnerHTML={{
                    __html: submissionOutput.data.failedTestCase.output,
                  }}
                />
              </div>
            </div>
            <div className="rounded-xl flex flex-col gap-3">
              <p className="text-xl font-bold">Code</p>
              <Editor
                height="425px"
                // className="w-full"
                // language="cpp" // Adjust the language based on your code
                value={submissionOutput.data.source_code}
                theme="vs-dark"
                options={{
                  readOnly: true, // Make it read-only
                  minimap: { enabled: false }, // Optional: Disable minimap for better UI
                  wordWrap: "on", // Wrap long lines of code
                  scrollBeyondLastLine: false, // Disable scrolling beyond last line
                  wrappingIndent: "same", // Maintain consistent wrapping indent
                  // automaticLayout: true, // Adjust layout on window resize
                }}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col w-full gap-5">
            <div className="flex items-center gap-5 w-full">
              <h1 className="text-red-500 text-2xl font-bold">
                Compilation Error
              </h1>
            </div>
            {/* <h1 className="text-red-500 text-2xl font-bold">Compilation Error</h1> */}
            <CompileTimeError err={submissionOutput.text} hideHeading={true} />
            <div className="rounded-xl flex flex-col gap-3">
              <p className="text-xl font-bold">Code</p>
              <Editor
                height="425px"
                // className="w-full"
                // language="cpp" // Adjust the language based on your code
                value={submissionOutput.data.source_code}
                theme="vs-dark"
                options={{
                  readOnly: true, // Make it read-only
                  minimap: { enabled: false }, // Optional: Disable minimap for better UI
                  wordWrap: "on", // Wrap long lines of code
                  scrollBeyondLastLine: false, // Disable scrolling beyond last line
                  wrappingIndent: "same", // Maintain consistent wrapping indent
                  // automaticLayout: true, // Adjust layout on window resize
                }}
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col w-full gap-5">
            <div className="flex items-center gap-5 w-full">
              <h1 className="text-red-500 text-2xl font-bold">
                Time Limit Exceeded
              </h1>
              <p className="text-gray-500 text-base">
                Testcases: {submissionOutput.data.passedTestCasesCnt}/
                {submissionOutput.data.totalTestCases}
              </p>
            </div>
            {/* <h1 className="text-red-500 text-2xl font-bold">Compilation Error</h1> */}
            {/* <CompileTimeError err={submissionOutput.text} hideHeading={true} /> */}
            <div className="flex">
              <div className="w-full">
                <p className="font-bold text-lg">Input</p>
                <div
                  className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                  dangerouslySetInnerHTML={{
                    __html: submissionOutput.data.failedTestCase.input,
                  }}
                />
                <p className="font-bold text-lg mt-3">Expected Output</p>
                <div
                  className="w-full p-5 rounded-xl bg-[#343333] flex items-center text-white mt-2"
                  dangerouslySetInnerHTML={{
                    __html: submissionOutput.data.failedTestCase.expectedOutput,
                  }}
                />
              </div>
            </div>
            <div className="rounded-xl flex flex-col gap-3">
              <p className="text-xl font-bold">Code</p>
              <Editor
                height="425px"
                // className="w-full"
                // language="cpp" // Adjust the language based on your code
                value={submissionOutput.data.source_code}
                theme="vs-dark"
                options={{
                  readOnly: true, // Make it read-only
                  minimap: { enabled: false }, // Optional: Disable minimap for better UI
                  wordWrap: "on", // Wrap long lines of code
                  scrollBeyondLastLine: false, // Disable scrolling beyond last line
                  wrappingIndent: "same", // Maintain consistent wrapping indent
                  // automaticLayout: true, // Adjust layout on window resize
                }}
              />
            </div>
          </div>
        );

      default:
        break;
    }
  };

  const runProblem = async () => {
    setrunStatus(0);
    const obj = {
      problemId: problemData.id,
      code: code,
      languageId: language.languageId,
      testcases: problemData.testcases,
      memoryLimit: problemData.memoryLimit,
      timeLimit: problemData.timeLimit,
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
      setrunStatus(json.code);
      setOutput(json.text);
      setPassedTestCases(json.data);
    } catch (error) {
      console.log(error);
      toast(error);
      setrunStatus(9);
    }
  };
  const submitProblem = async () => {
    setSubmitStatus(0);
    setTab("submission_status");
    try {
      const obj = {
        problemId: problemData.id,
        code: code,
        languageId: language.languageId,
        userId: USER.userId,
        memoryLimit: problemData.memoryLimit,
        timeLimit: problemData.timeLimit,
      };
      const response = await fetch("/api/submission/submit", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      if (!response.ok) {
        throw new Error("Internal server error");
      }
      const json = await response.json();
      console.log(json);
      setSubmissionOutput(json);
      setTab("submission_status");
      setSubmitStatus(json.code);
    } catch (error) {
      console.log(error);
      toast(error.message);
      setSubmitStatus(9);
      setTab("problem")
    }
  };
  useEffect(() => {
    loadProblem();
  }, [USER]);
  return (
    <div className="w-full md:px-5 px-2 h-screen flex">
      {/* problem statement */}
      <div className="md:w-1/2 w-full h-screen overflow-y-scroll overflow-x-hidden py-5 pt-20 px-2">
        {!problemData ? (
          <ProblemStatementSkeleton />
        ) : (
          <div className="w-full mr-5 h-full pb-5">
            <Tabs
              defaultValue="problem"
              value={tab}
              className="w-full pb-5 flex flex-col items-center pr-4 h-full"
              onValueChange={(value) => setTab(value)}
            >
              <TabsList className="mb-2">
                <TabsTrigger value="problem">Problem</TabsTrigger>
                <TabsTrigger value="submission">Submissions</TabsTrigger>
                {submitStatus !== 9 && (
                  <TabsTrigger value="submission_status">
                    Submission status
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="problem" className="w-full h-full pb-5">
                <ProblemStatement
                  problemData={problemData}
                  setProblemData={setProblemData}
                />
              </TabsContent>
              <TabsContent value="submission" className="w-full h-full pb-5">
                <Submissions problemId={problemData.id} />
              </TabsContent>
              {submitStatus !== 9 && (
                <TabsContent value="submission_status" className="w-full pb-5">
                  {submitStatus === 0 ? <SubmissionStatusSkeleton/>:getSubmissionStatusHTML()}
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </div>
      {/* code editor */}
      <div className="w-1/2 h-screen overflow-y-scroll py-5 pt-20 md:block hidden">
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
            runStatus={runStatus}
            submitStatus={submitStatus}
          />
        )}
        {!problemData || runStatus === 0 ? (
          <TestCasesSkeleton />
        ) : (
          getTestCases()
        )}
      </div>
    </div>
  );
};

export default page;
