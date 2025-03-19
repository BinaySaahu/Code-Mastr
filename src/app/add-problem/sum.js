process.stdin.resume();
process.stdin.setEncoding("utf8");
function sum(a1, b2) {
  //Write your code here
  return a1 + b2;
}
process.stdin.on("data", function (data) {
  let input1 = data.trim().split(" ").map();
  let input2 = data.trim().split(" ").map();

  let ans = sum(input1, input2);
  console.log(ans);
  process.exit();
});
