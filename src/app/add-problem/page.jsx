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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import isAuth from "@/custom-components/utils/isAuth";
import { useSelector } from "react-redux";
import LoggedOutOverlay from "@/custom-components/LoggedOutOverlay";

const page = () => {
  const TOPICS = [
    "DP",
    "HashMap",
    "Sliding window",
    "Two pointers",
    "Greedy",
    "Array",
    "String",
    "Math",
    "Bit manipulation",
    "Breadth first search(bfs)",
    "Depth first search(dfs)",
    "Recursion",
    "Backtracking",
    "Stack",
    "Queue",
    "Priority Queue(Heap)",
    "Tree",
    "Binary search tree",
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const solutionsRef = useRef();
  const testsRef = useRef();
  const structureRef = useRef();

  const USER = useSelector((state) => state.user);

  const submitProblem = async (data) => {
    setLoading(true);
    data = { ...data, desc: desc, topics: topics, difficulty: difficulty };
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("solutions", solutions); // If solutions is a file
    formData.append("testcases", tests); // If testCases is a file
    formData.append("structure", structure);
    if (
      !data.name ||
      !data.desc ||
      !data.topics ||
      !data.difficulty ||
      !data.mem_limit ||
      !data.time_limit ||
      !solutions ||
      !tests ||
      !structure
    ) {
      setError("Please fill out all the fields");
      toast("Please fill out all the fields");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/add-problem", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      console.log("json->", json);

      if (response.ok) {
        toast("Problem added successfully");
        setLoading(false);
      } else {
        throw new Error(json.text);
      }
    } catch (error) {
      console.log(error);
      toast("Internal server error");
      setLoading(false);
    }
  };
  console.log(desc);
  return (
    <>
      {USER.userId === "" ? (
        <div className={`relative w-full flex items-center justify-center pt-20 h-screen`}>
          <Loader2 className="animate-spin"/>Loading...
        </div>
      ) : (
        <div className={`relative w-full flex items-center justify-center pt-20 ${!USER.admin ? "h-screen": "h-full"}`}>
          {!USER.admin && (
            <LoggedOutOverlay text="You are not authorized to access this,<br/> you need admin credentials to access this" />
          )}
          <Card className="w-1/2">
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
              <form
                onSubmit={handleSubmit(submitProblem)}
                className="gap-4 flex flex-col"
              >
                <Input
                  type="text"
                  placeholder="Problem Name"
                  {...register("name")}
                />
                <RichTextEditor setDesc={setDesc} />
                <Select onValueChange={(value) => setDifficulty(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FancyMultiSelect
                  selected={topics}
                  setSelected={setTopics}
                  TOPICS={TOPICS}
                />
                <div className="flex items-center gap-3 w-full">
                  <Input
                    type="text"
                    placeholder="Memory limit (in KB)"
                    {...register("mem_limit")}
                  />
                  <Input
                    type="text"
                    placeholder="Time limit (in seconds)"
                    {...register("time_limit")}
                  />

                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div
                    className="bg-transparent rounded-lg flex items-center border w-full p-4 gap-3 cursor-pointer"
                    onClick={() => solutionsRef.current.click()}
                  >
                    <FaFileArchive color="#262626" size={25} />
                    {solutions ? (
                      <p className="text-xs font-semibold">
                        solutions.{solutions.name.split(".")[1]}
                      </p>
                    ) : (
                      <p className="text-xs font-semibold">
                        Upload the solutions (.zip)
                      </p>
                    )}
                    <Input
                      type="file"
                      className="hidden"
                      ref={solutionsRef}
                      onChange={(e) => setSolutions(e.target.files[0])}
                    />
                  </div>
                  <div
                    className="bg-transparent rounded-lg flex items-center border w-full p-4 gap-3 cursor-pointer"
                    onClick={() => testsRef.current.click()}
                  >
                    <FaFileArchive color="#262626" size={25} />
                    {tests ? (
                      <p className="text-xs font-semibold">
                        testcases.{tests.name.split(".")[1]}
                      </p>
                    ) : (
                      <p className="text-xs font-semibold">
                        Upload the test cases (.zip)
                      </p>
                    )}
                    <Input
                      type="file"
                      className="hidden"
                      ref={testsRef}
                      onChange={(e) => setTests(e.target.files[0])}
                    />
                  </div>
                  <div
                    className="bg-transparent rounded-lg flex items-center border w-full p-4 gap-3 cursor-pointer"
                    onClick={() => structureRef.current.click()}
                  >
                    <AiFillFileMarkdown
                      color="#262626"
                      size={25}
                      opacity={80}
                    />
                    {structure ? (
                      <p className="text-xs font-semibold">
                        structure.{structure.name.split(".")[1]}
                      </p>
                    ) : (
                      <p className="text-xs font-semibold">
                        Upload the structure (.md)
                      </p>
                    )}
                    <Input
                      type="file"
                      className="hidden"
                      ref={structureRef}
                      onChange={(e) => setStructure(e.target.files[0])}
                    />
                  </div>
                </div>

                {loading ? (
                  <Button disabled>
                    <Loader2 className="animate-spin" />
                    Submitting
                  </Button>
                ) : (
                  <Button>Submit</Button>
                )}
              </form>
            </CardContent>
            {/* {error && (
          <p className="text-red-600 w-full text-center mt-1 text-xs">
            {error}
          </p>
        )} */}
          </Card>
        </div>
      )}
    </>
  );
};

export default isAuth(page);
