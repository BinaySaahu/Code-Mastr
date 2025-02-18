export const LANGUAGE_VERSIONS = {
  javascript: {
    name: "JavaScript",
    version: "22.08.0",
    id: 102,
  },
  python: {
    name: "Python",
    version: "3.12.5",
    id: 100,
  },
  java: {
    name: "Java",
    version: "17.0.6",
    id: 91,
  },
  csharp: {
    name: "C#",
    version: "6.6.0.161",
    id: 51,
  },
  php: {
    name: "PHP",
    version: "8.3.11",
    id: 98,
  },
  cpp: {
    name: "C++",
    version: "14.1.0",
    id: 105,
  },
};

export const CODE_SNIPPETS = {
  Language:'// Select a language of your choice',
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
  cpp: "#include<iostream>\nusing namespace std;\nint main(){\n\t//Your code\n\treturn 0;\n}",
};
