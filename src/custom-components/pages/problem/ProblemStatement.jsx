"use client"

import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import React from "react";

const ProblemStatement = ({problemData, executionStatus}) => {
  return (
    <>
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
    </>
  );
};

export default ProblemStatement;
