"use client"

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

const ProblemList = () => {
  const [problemList, setProblemList] = useState([]);
  const USER = useSelector((state) => state.user);
  const loadProblems = async()=>{
    console.log("User data",USER)
    try {
      const response = await fetch('/api/problems');
      console.log(response)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      // console.log("Problems->", json)
      setProblemList(json);
    } catch (error) {
      console.error(error.message);
    }

  }
  useEffect(()=>{
    loadProblems();
  },[])
  // const problemList = [
  //   {
  //     problemName: "Two Sum",
  //     difficulty: "Easy",
  //     id: 1,
  //     topic: ["Array"],
  //   },
  //   {
  //     problemName: "Three Sum",
  //     difficulty: "Medium",
  //     id: 2,
  //     topic: ["Array", "HashMap"],
  //   },
  //   {
  //     problemName: "Four Sum",
  //     difficulty: "Hard",
  //     id: 3,
  //     topic: ["Array", "Sum", "HashMap"],
  //   },
  // ];
  let pages = Math.ceil(problemList.length / 10);
  return (
    <div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sl.No</TableHead>
            <TableHead className="w-[20px]">Staus</TableHead>
            <TableHead>Problem</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Topics</TableHead>
            {/* <TableHead className="text-right"></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {problemList?.map((problem, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell className="font-medium">{problem.id}</TableCell>
                <TableCell className="font-medium">
                  {
                    
                  }
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
                      return <Badge variant="outline" key={index}>{t}</Badge>;
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
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            {[...Array(pages)].map((element, idx) => {
              return (
                <PaginationItem className="border rounded" key={idx}>
                  <PaginationLink href="#">{idx + 1}</PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ProblemList;
