"use client"
import React from 'react'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
const CodeEditor = () => {
    // const monaco = Editor.arguments.
    // const monaco = useMonaco()
    
    // console.log("Language->",monaco?.editor?.getModel().getLanguageIdentifier().language)
  return (
    <div>
      <Editor height="70vh" defaultLanguage="javascript" language='C++' defaultValue="#include<bits/stdc++.h> \n int main(){\n //Your code goes here\n}" />;
    </div>
  )
}

export default CodeEditor
