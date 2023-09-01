import dayjs from "dayjs";

export const getDateData = (value: number, levels: number[], colors: string) => {
  for (let i = 0; i < levels.length; i++) {
    if (value < levels[i]) return colors[i];
  }
};

// Month [0-11]
export const createMonthData = (month: number, year: number, data?: Record<string, number>) => {
  const selectedYear = year ?? dayjs().year();
  const matrix = Array(7)
    .fill(null)
    .map(() => Array(6).fill({})); // 7 day with 6 week

  const startDate = dayjs().year(selectedYear).month(month).date(1);

  for (let d = 1; d <= 31; d++) {
    //Date: Numbers from 1 to 31
    const date = dayjs().year(selectedYear).month(month).date(d);
    const rowIndex = date.day(); //  Day: Numbers from 0 (Sunday) to 6 (Saturday) -> row
    const colIndex = Math.floor((startDate.day() + d - startDate.date()) / 7);
    const formatedDate = date.format("DD/MM/YYYY")
    matrix[rowIndex][colIndex] = {
      date: formatedDate,
      value: data?.[formatedDate] ?? null,
      show: date.month() === month
    };
  }

  let currentDate = startDate;

  while (currentDate.day() > 0) {
    const date = currentDate.subtract(1, 'day');
    const formatedDate = date.format("DD/MM/YYYY")
    matrix[date.day()][0] = {
      date: formatedDate,
      value: data?.[formatedDate] ?? null,
      show: date.month() === month
    };
    currentDate = date
  }

  return matrix;
};

// Check last column to count the empty cell
export const getNumberMostRightEmptyColumns = (matrix: ReturnType<typeof createMonthData>) => {
  let count = 0;
  for (let i = 0; i < 6; i++) {
    if (!matrix[6][i].show) {
      count++;
    }
  }

  return count;
};

export const getFlatMonthData = (matrix: ReturnType<typeof createMonthData>) => {
  const flatData = [];

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      flatData.push(matrix[i][j]);
    }
  }

  return flatData;
};
