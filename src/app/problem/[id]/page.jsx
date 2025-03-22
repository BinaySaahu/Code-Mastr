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

const page = ({ params }) => {
  const [problemData, setProblemData] = useState();
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
    } catch (error) {
      console.error(error);
      toast(error.message);
    }
  };
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
          <CodeEditor codeSnippets={problemData?.languages} />
        )}
        {!problemData ? (
          <TestCasesSkeleton />
        ) : (
          <TestCases testCases={testCases} />
        )}
        
      </div>
    </div>
  );
};

export default page;
