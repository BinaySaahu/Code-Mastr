"use client";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import RichTextEditor from "@/custom-components/rich-text-editor/RichTextEditor";
import { Button } from "@/components/ui/button";
import FancyMultiSelect from "@/custom-components/multiSelect/MultiSelect";
import { FaFileArchive } from "react-icons/fa";
import { AiFillFileMarkdown } from "react-icons/ai";

const page = () => {
  const TOPICS = [
    { value: "dp", label: "DP" },
    { value: "array", label: "Array" },
    { value: "string", label: "String" },
    { value: "math", label: "Math" },
    { value: "bits", label: "Bit manipulation" },
    { value: "bfs", label: "Breadth first search(bfs)" },
    { value: "dfs", label: "Depth first search(dfs)" },
    { value: "recursion", label: "Recursion" },
    { value: "backtracking", label: "Backtracking" },
    { value: "stack", label: "Stack" },
    { value: "queue", label: "Queue" },
    { value: "priority_queue", label: "Priority Queue(Heap)" },
    { value: "tree", label: "Tree" },
    { value: "bst", label: "Binary search tree" },
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [desc, setDesc] = useState("");
  const [topics, setTopics] = useState([TOPICS[0]]);
  const [difficulty, setDifficulty] = useState();
  const [solutions, setSolutions] = useState();
  const [tests, setTests] = useState();
  const [structure, setStructure] = useState();

  const solutionsRef = useRef()
  const testsRef = useRef()
  const structureRef = useRef()

  const submitProblem = (data) => {
    data = { ...data, desc: desc, topics: topics, difficulty: difficulty, solutions: solutions, testCases: tests, structure: structure };
    console.log(data);
  };
  console.log(desc);
  return (
    <div className="w-full flex items-center justify-center pt-20">
      <Card className = "w-1/2">
        <CardHeader>
          <CardTitle>Add a Problem</CardTitle>
          <CardDescription>
            To check the format of the files to uploaded click{" "}
            <a href="/" className="cursor-pointer text-blue-600">
              here
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitProblem)} className="gap-4 flex flex-col">
            <Input
              type="text"
              placeholder="Problem Name"
              {...register("name", {
                required: "Please enter the problem name",
              })}
            />
            <RichTextEditor setDesc={setDesc} />
            <Select onValueChange={(value)=>setDifficulty(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <FancyMultiSelect selected = {topics} setSelected = {setTopics} TOPICS = {TOPICS}/>
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="bg-transparent rounded-lg flex items-center border w-full p-4 gap-3 cursor-pointer" onClick={()=>solutionsRef.current.click()}>
                <FaFileArchive color="#262626" size={25}/>
                {solutions ? <p className="text-xs font-semibold">solutions.{solutions.name.split('.')[1]}</p>:
                <p className="text-xs font-semibold">Upload the solutions (.zip)</p>}
                <Input type = "file" className = "hidden" ref={solutionsRef} onChange = {(e)=>setSolutions(e.target.files[0])}/>  
              </div>
              <div className="bg-transparent rounded-lg flex items-center border w-full p-4 gap-3 cursor-pointer" onClick={()=>testsRef.current.click()}>
                <FaFileArchive color="#262626" size={25}/>
                {tests? <p className="text-xs font-semibold">testcases.{tests.name.split('.')[1]}</p>:
                <p className="text-xs font-semibold">Upload the test cases (.zip)</p>}
                <Input type = "file" className = "hidden" ref={testsRef} onChange = {(e)=>setTests(e.target.files[0])}/>  
              </div>
              <div className="bg-transparent rounded-lg flex items-center border w-full p-4 gap-3 cursor-pointer" onClick={()=>structureRef.current.click()}>
                <AiFillFileMarkdown color="#262626" size={25} opacity={80}/>
                {structure ? <p className="text-xs font-semibold">structure.{structure.name.split('.')[1]}</p> :<p className="text-xs font-semibold">Upload the structure (.md)</p>}
                <Input type = "file" className = "hidden" ref={structureRef} onChange = {(e)=>setStructure(e.target.files[0])}/>  
              </div>

            </div>

            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
