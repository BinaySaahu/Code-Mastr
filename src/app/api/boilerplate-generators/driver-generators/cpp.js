const { convertToActualInputs } = require("../helpers/cpp/actual-inputs");

export const generateCppMain = (inputs, functionName, output) => {
  let actualInputFields = convertToActualInputs(inputs);

  const code = `int main(){\n${actualInputFields
    .map((inp, idx) => {
      if (
        inp.startsWith("int") ||
        inp.startsWith("string") ||
        inp.startsWith("char") ||
        inp.startsWith("float") ||
        inp.startsWith("double") ||
        inp.startsWith("long long") ||
        inp.startsWith("bool")
      ) {
        return `${inp};\ncin >> ${inp.split(" ")[1]};\n`;
      } else if (
        inp.startsWith("vector<int>") ||
        inp.startsWith("vector<string>") ||
        inp.startsWith("vector<char>") ||
        inp.startsWith("vector<float>") ||
        inp.startsWith("vector<double>") ||
        inp.startsWith("vector<long long>") ||
        inp.startsWith("vector<bool>")
      ) {
        return `int size${idx};\ncin>>size${idx};\n${inp}(size${idx});\nfor(int i = 0;i<size${idx};++i){\n  cin>>${
          inp.split(" ")[1]
        }[i];\n}\n`;
      } else {
        return `int row${idx},col${idx};\ncin>>row${idx}>>col${idx};\n${inp}(row${idx},vector<${
          inp.split(" ")[0].match(/<(\w+)>/)[1]
        }>(col${idx}));\nfor(int i = 0;i<row${idx};++i){\nfor(int j = 0;j<col${idx};++j){\n  cin>>${
          inp.split(" ")[1]
        }[i][j];\n}\n}\n`;
      }
    })
    .join("")}\ncout<<${functionName}(${actualInputFields
    .map((inpt) => {
      return inpt.split(" ")[1];
    })
    .join(",")});\nreturn 0;\n}`;
  return code;
};

// module.exports.generateCppMain = generateCppMain
