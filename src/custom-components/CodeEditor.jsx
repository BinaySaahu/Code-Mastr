"use client";
import React, { useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
const CodeEditor = ({codeSnippets}) => {
  const [language, setLanguage] = useState(codeSnippets[0]);
  const [code, setCode] = useState(codeSnippets[0].boilerplateCode)
  const handleLanguage = (slug)=>{
    // console.log(language)
    codeSnippets.forEach((code)=>{
      if(code.slug === slug){
        setLanguage(code);
        setCode(code.boilerplateCode)
      }
    })

  }

  return (
    <div className="border-[#fff]/[50%] border rounded-md p-3">
      <div className="flex justify-between items-center">
      <Select defaultValue={language.slug} onValueChange={(value)=>handleLanguage(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`${language?.name}&nbsp;(${language?.version})`} />
        </SelectTrigger>
        <SelectContent>
          {codeSnippets?.map((language,idx) => (
            <SelectItem value={language.slug} key={idx}>{language.name}&nbsp;({language.version})</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2">
        <Button variant = "outline">Run</Button>
        <Button variant = "default">Submit</Button> 
      </div>

      </div>
      <div className="mt-3">
        <Editor
          height="60vh"
          language={language.slug}
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value)}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
