export const getAverageOfNumberList = (numberList: number[]) => {
  return numberList.reduce((acc, cur) => acc + cur, 0) / numberList.length;
}