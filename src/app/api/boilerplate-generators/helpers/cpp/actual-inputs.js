// const allDataTypes = require('data')

const { mapCppType } = require("./datatype-mapping");
const { allDataTypes } = require("./datatypes");

export const convertToActualInputs = (inputs) => {
  // console.log("Inputs",inputs)
  let actualInputFields = [];
  inputs.map((input, idx) => {
    const dataType = mapCppType(input);
    const name = input.split(" ")[1];
    if (allDataTypes.includes(dataType)) {
      actualInputFields.push(`${dataType} ${name}`);
    } else {
      actualInputFields.push(`${dataType} ${name}`);
    }
  });
  // console.log("Actuals",actualInputFields)
  return actualInputFields;
};

// module.exports.convertToActualInputs = convertToActualInputs