"use client";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Editor } from "@monaco-editor/react";

const Submissions = ({ submissions }) => {
  console.log(submissions);
  const getStatusColor = (status) => {
    if (status === "processing") {
      return "text-orange-400";
    } else if (status === "ACCEPTED") {
      return "text-green-500";
    } else if (status === "ATTEMPTED") {
      return "text-yellow-400";
    }
    return "text-red-500";
  };
  return (
    <div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sl.no</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="">Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell className="font-medium">
                  {submission.createdAt}
                </TableCell>
                <TableCell
                  className={`font-medium ${getStatusColor(submission.status)}`}
                >
                  {submission.status}
                </TableCell>
                <TableCell className="font-medium">
                  <Dialog className="">
                    <Badge variant="secondary">
                      <DialogTrigger>{"</>"}</DialogTrigger>
                    </Badge>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Code</DialogTitle>
                      </DialogHeader>
                      <div className="rounded-xl p-5">
                        <Editor
                          height ="425px"
                          // className="w-full"
                          // language="cpp" // Adjust the language based on your code
                          value={submission.code}
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
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Submissions;
