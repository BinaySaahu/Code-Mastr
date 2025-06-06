"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { useSelector } from "react-redux";
import { MdErrorOutline, MdOutlineDone } from "react-icons/md";
import { FaCircleNotch } from "react-icons/fa6";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProblemListSkeleton from "./ProblemListSkeleton";

const ProblemList = () => {
  const [fetchErr, setFetchErr] = useState(false)
  const [problemList, setProblemList] = useState();
  const [pageNum, setPageNum] = useState(1);
  const [pageProblems, setPageProblems] = useState();
  const USER = useSelector((state) => state.user);

  const handlePagination = (page) => {
    setPageNum(page);
    let start = page * 10 - 10;
    let end = Math.min(start + 10, problemList?.length);
    console.log(pageNum + "start->" + start + "end->" + end);
    setPageProblems(problemList?.slice(start, end));
  };
  const loadProblems = async () => {
    try {
      const response = await fetch(`/api/problems?userId=${USER.userId}`);
      console.log(response);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      setProblemList(json);
      handlePagination(1);
      // setLoading(false);
    } catch (error) {
      setPageProblems([])
      console.log(error.message);
      setFetchErr(true)
    }
  };

  const getStatus = (problem)=>{
    if(problem.status && problem.status === "ACCEPTED"){
      return <MdOutlineDone size={20} color={"green"}/>;
    }else if(problem.status && problem.status !== "ACCEPTED"){
      return <FaCircleNotch size={20} color={"orange"}/>;
    }else return null
  }
  useEffect(() => {
    loadProblems();
  }, [USER]);

  useEffect(() => {
    handlePagination(1);
  }, [problemList]);

  let pages = Math.ceil(problemList?.length / 10);
  return (
    <div className="h-full flex items-center justify-center w-full">
      {
        
      (!pageProblems? (
        <ProblemListSkeleton/>
      ) : (
        fetchErr ? 
        <p className="text-red-500 text-base flex items-center gap-1"><MdErrorOutline color="red"/>Error in fetching the problems</p>
        :
        <div className="flex flex-col justify-between h-full w-full">
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow className = "md:text-base text-xs">
                <TableHead className="md:block hidden">Sl.No</TableHead>
                <TableHead className="">Status</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Topics</TableHead>
                {/* <TableHead className="text-right"></TableHead> */}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {pageProblems?.map((problem, idx) => {
                return (
                  <TableRow key={idx} className = "md:text-base text-xs">
                    <TableCell className="font-medium md:block hidden">{idx+1}</TableCell>
                    <TableCell className="font-medium">
                      {getStatus(problem)}
                    </TableCell>
                    <TableCell>{problem.name}</TableCell>
                    <TableCell>
                      <Badge variant={problem.difficulty}>
                        {problem.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center flex-wrap gap-2">
                        {problem.topics.map((t, index) => {
                          return (
                            <Badge variant="outline" key={index}>
                              {t.topic}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/problem/${problem.id}`}>
                        <Button>Solve</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="mt-5">
            <Pagination>
              <PaginationContent className = "md:text-base text-xs">
                <PaginationItem
                  className={`${pageNum === 1 && "cursor-not-allowed"}`}
                >
                  {pageNum === 1 ? (
                    <p className="text-white/[40%] flex items-center gap-1 p-2.5 text-sm">
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </p>
                  ) : (
                    <PaginationPrevious
                      href={`#`}
                      onClick={() => handlePagination(pageNum - 1)}
                    />
                  )}
                </PaginationItem>
                {[...Array(pages)].map((element, idx) => {
                  return (
                    <PaginationItem
                      className={`border rounded mx-1.5`}
                      key={idx}
                      onClick={() => handlePagination(idx + 1)}
                    >
                      <PaginationLink
                        className={`${
                          idx + 1 === pageNum &&
                          "bg-white text-black hover:!bg-white hover:text-black"
                        }`}
                        href={`#`}
                      >
                        {idx + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem
                  className={`${pageNum === pages && "cursor-not-allowed"}`}
                >
                  {pageNum === pages ? (
                    <p className="text-white/[40%] flex items-center gap-1 p-2.5 text-sm">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </p>
                  ) : (
                    <PaginationNext
                      href={`#`}
                      onClick={() => handlePagination(pageNum + 1)}
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      ))
      }
    </div>
  );
};

export default ProblemList;
