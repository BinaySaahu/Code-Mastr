"use client";
import React, { useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "@/app/Languages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(CODE_SNIPPETS[language])
  let ALL_LANGUAGES = Object.keys(LANGUAGE_VERSIONS);
  const handleLanguage = (language)=>{
    console.log(language)
    setLanguage(language);
    setCode(CODE_SNIPPETS[language])

  }

  return (
    <div className="border-[#fff]/[50%] border rounded-md p-3">
      <div className="flex justify-between items-center">
      <Select defaultValue="javascript" onValueChange={(value)=>handleLanguage(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {ALL_LANGUAGES.map((language,idx) => (
            <SelectItem value={language} key={idx}>{language}</SelectItem>
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
          language={language}
          value={code}
          theme="vs-dark"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
