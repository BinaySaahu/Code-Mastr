const generateJSMain = (inputs, functionName) => {
  let actualInputsCode = [];
  let inpCnt = 1;
  let arrCnt = 1;
  let arr2dCnt = 1;
  inputs.map((inp) => {
    if (inp.startsWith("List<int>")) {
      const code = `let arr${arrCnt} = data.trim().split(" ").map(Number);\n`;
      actualInputsCode.push({ code: code, variable: `arr${arrCnt}` });
      arrCnt++;
    } else if (inp.startsWith("List<List<int>")) {
      const code = `let arr${arr2dCnt} = data.trim().split("\n").map(line => line.split(" ").map(Number));\n`;
      actualInputsCode.push({ code: code, variable: `arr${arr2dCnt}` });
      arr2dCnt++;
    } else if (inp.startsWith("List<List<")) {
      const code = `let arr${arr2dCnt} = data.trim().split("\n").map(line => line.split(" ").map());\n`;
      actualInputsCode.push({ code: code, variable: `arr${arr2dCnt}` });
      arr2dCnt++;
    } else {
      const code = `let input${inpCnt} = data.trim().split(" ").map();\n`;
      actualInputsCode.push({ code: code, variable: `input${inpCnt}` });
      inpCnt++;
    }
  });

  return `${actualInputsCode
    .map((inp) => {
      return inp.code;
    })
    .join("")}\nlet ans = ${functionName}(${actualInputsCode
    .map((inp) => {
      return inp.variable;
    })
    .join(",")});\nconsole.log(ans);`;
};

module.exports.generateJSMain = generateJSMain
