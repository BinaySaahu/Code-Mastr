const generateJSFunction = (inputs, functionName) => {
  let actualInputFields = inputs.map((inp) => inp.split(" ")[1]);

  let code = `function ${functionName}(${actualInputFields.map((inp) => {
    return `${inp}`;
  })}){\n  //Write your code here\n}`;

  return code;
};


module.exports.generateJSFunction = generateJSFunction