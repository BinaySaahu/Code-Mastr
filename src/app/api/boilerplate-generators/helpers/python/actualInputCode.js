export const getListCode = (inp) => {
  if (inp.includes("<int>")) {
    return `${inp.split(" ")[1]}=input()\n${
      inp.split(" ")[1]
    }=list(map(int,arr.split(' ')))\n`;
  } else if (inp.includes("<float>")) {
    return `${inp.split(" ")[1]}=input()\n${
      inp.split(" ")[1]
    }=list(map(float,arr.split(' ')))\n`;
  } else {
    return `${inp.split(" ")[1]}=input()\n${
      inp.split(" ")[1]
    }=list(arr.split(' '))\n`;
  }
};

export const get2DListCode = (inp, rowColCnt) => {
  if (inp.includes("<int>")) {
    return `row${rowColCnt} = int(input())\ncol${rowColCnt}=int(input())\n${
      inp.split(" ")[1]
    } = []\nfor x in range(row${rowColCnt}):\n    ${
      inp.split(" ")[1]
    }.append([int(y) for y in input().split()])\n`;
  } else if (inp.includes("<float>")) {
    return `row${rowColCnt} = int(input())\ncol${rowColCnt}=int(input())\n${
      inp.split(" ")[1]
    } = []\nfor x in range(row${rowColCnt}):\n    ${
      inp.split(" ")[1]
    }.append([float(y) for y in input().split()])\n`;
  } else {
    return `row${rowColCnt} = int(input())\ncol${rowColCnt}=int(input())\n${
      inp.split(" ")[1]
    } = []\nfor x in range(row${rowColCnt}):\n    ${
      inp.split(" ")[1]
    }.append([y for y in input().split()])\n`;
  }
};
