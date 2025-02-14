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

const ProblemList = () => {
  const problemList = [
    {
      problemName: "Two Sum",
      difficulty: "Easy",
      topic: ["Array"],
    },
    {
      problemName: "Three Sum",
      difficulty: "Medium",
      topic: ["Array", "HashMap"],
    },
    {
      problemName: "Four Sum",
      difficulty: "Hard",
      topic: ["Array", "Sum", "HashMap"],
    },
  ];
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
                  {problem.topic.map((t, idx) => {
                    return (
                      <Badge variant="outline">{t}</Badge>
                    );
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button>Solve</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProblemList;
