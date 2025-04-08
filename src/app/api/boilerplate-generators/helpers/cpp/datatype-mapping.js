const { allDataTypes } = require("./datatypes");

export const mapCppType = (str) => {
  const s = str.split(" ")[0];
  for (let index = 0; index < allDataTypes.length; index++) {
    const element = allDataTypes[index];
    if (s === `List<${element}>`) return `vector<${element}>`;
    else if (s === `List<List<${element}>>`)
      return `vector<vector<${element}>>`;
  }
  return s;
};

// module.exports.mapCppType = mapCppType
