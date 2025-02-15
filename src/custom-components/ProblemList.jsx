import React from "react";
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

const ProblemList = () => {
  const problemList = [
    {
      problemName: "Two Sum",
      difficulty: "Easy",
      id: 1,
      topic: ["Array"],
    },
    {
      problemName: "Three Sum",
      difficulty: "Medium",
      id: 2,
      topic: ["Array", "HashMap"],
    },
    {
      problemName: "Four Sum",
      difficulty: "Hard",
      id: 3,
      topic: ["Array", "Sum", "HashMap"],
    },
  ];
  let pages = Math.ceil(problemList.length / 10);
  return (
    <div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sl.No</TableHead>
            <TableHead>Problem</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Topics</TableHead>
            {/* <TableHead className="text-right"></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {problemList.map((problem, idx) => {
            return (
              <TableRow>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{problem.problemName}</TableCell>
                <TableCell>
                  <Badge variant={problem.difficulty}>
                    {problem.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center flex-wrap gap-2">
                    {problem.topic.map((t, idx) => {
                      return <Badge variant="outline">{t}</Badge>;
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
                <PaginationItem className="border rounded">
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
