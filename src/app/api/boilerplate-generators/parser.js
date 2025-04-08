export function parser(data){
  // const data = fs.readFileSync("./structure.md", "utf8");
  const lines = data.split("\n");
  let inputs = [];
  let functionName = "";
  let output = "";

  lines.forEach((line) => {
    if (line.startsWith("Function name:")) {
      functionName = line.split(":")[1].trim();
      // console.log(functionName);
    } else if (line.startsWith("Input field:")) {
      const inp = line.split(":")[1].trim();
      inputs.push(inp);
    } else if (line.startsWith("Output field:")) {
      output = line.split(":")[1].trim();
    }
  });

  return{
    functionName: functionName,
    inputs: inputs,
    output: output
  }


  // fs.writeFileSync(`./${functionName}.cpp`,`#include<bits/stdc++.h>\nusing namespace std;\n${generateCppFunction(inputs, functionName, output)}${generateCppMain(inputs, functionName, output)}`)

  // console.log(generateJSFunction(inputs, functionName))
  // console.log(generateJSMain(inputs, functionName))

  // fs.writeFileSync(`./${functionName}.js`,`process.stdin.resume();\nprocess.stdin.setEncoding("utf8");\n${generateJSFunction(inputs, functionName)}\nprocess.stdin.on("data",function(data){\n${generateJSMain(inputs, functionName)}\n  process.exit();\n})`)
  
};

// module.exports.parser = parser

// parser();
