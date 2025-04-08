const { convertToActualInputs } = require("../helpers/cpp/actual-inputs");
const { mapCppType } = require("../helpers/cpp/datatype-mapping");

export const generateCppFunction = (inputs, functionName, output) => {
  let actualInputFields = convertToActualInputs(inputs);

  let actualOutput = mapCppType(output);

  let code = `${actualOutput} ${functionName} (${actualInputFields
    .map((inpt) => {
      return inpt;
    })
    .join(",")}){\n  //Implement code here.\n}`;

  return code;
};

// module.exports.generateCppFunction = generateCppFunction
