"use client";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdOutlineDone } from "react-icons/md";
import { FaCircleNotch } from "react-icons/fa6";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const ProblemStatement = ({ problemData, setProblemData}) => {
  const USER = useSelector((state) => state.user);
  const loadProblem = async () => {
    // setLoading(true);
    // const par = await params;
    try {
      const response = await fetch(
        `/api/get-problem?id=${problemData.id}&userId=${USER.userId}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Error in fetching problem");
      }
      console.log("data->", data.problem);
      setProblemData(data.problem);
      // setLanguage(data.problem.languages[0]);
      // setCode(data.problem.languages[0].boilerplateCode);
      // setSubmissions(data.submissions);
      // setLoading(false);
    } catch (error) {
      console.error(error);
      toast(error.message);
      // setLoading(false);
    }
  };
  const getStatus = () => {
    if (problemData.status === "ACCEPTED") {
      return <div className="flex items-center gap-2"><MdOutlineDone size={20} color={"green"}/> Solved</div>;
    }else if(problemData.status === "NOT ATTEMPTED"){
      return null

    }else{
      return <div className="flex items-center gap-2"><FaCircleNotch size={20} color={"orange"}/> Attempted</div>;
    }
  };
  useEffect(() => {
      loadProblem();
    }, [USER]);
  return (
    <div className="h-full">
      <div className="w-full flex items-center justify-between">
        <h2 className="font-bold text-3xl">{problemData?.name}</h2>
        {getStatus()}
      </div>
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
  );
};

export default ProblemStatement;
