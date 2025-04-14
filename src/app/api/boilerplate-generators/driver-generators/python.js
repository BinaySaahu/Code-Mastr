import { get2DListCode, getListCode } from "../helpers/python/actualInputCode";

export const generatePyMain = (inputs, functionName) => {
  let code = "";
  let sizeCnt = 1;

  let rowColCnt = 1;
  inputs.map((inp) => {
    if (inp.startsWith("List<List<")) {
      code += get2DListCode(inp, rowColCnt);
      rowColCnt++;
    } else if (inp.startsWith("List<")) {
      code += getListCode(inp);
      sizeCnt++;
    } else if (inp.startsWith("int")) {
      code += `${inp.split(" ")[1]} = int(input())\n`;
    } else {
      code += `${inp.split(" ")[1]} = input()\n`;
    }
  });
  code += `ans = ${functionName}(${inputs
    .map((i) => {
      return i.split(" ")[1];
    })
    .join(",")})\nprint(ans)`;

  return code;
};
