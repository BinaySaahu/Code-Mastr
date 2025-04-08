export const generatePyFunction = (inputs, functionName)=>{
  let actualInputFields = inputs.map((inp)=> inp.split(" ")[1]);
  let code = `def ${functionName}(${actualInputFields.map((inp)=>{return `${inp}`}).join(", ")}):\n  #Write your code`
  return code;

}

// module.exports.generatePyFunction = generatePyFunction