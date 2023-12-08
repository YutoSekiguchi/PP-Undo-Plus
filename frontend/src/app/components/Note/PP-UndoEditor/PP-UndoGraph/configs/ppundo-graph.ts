let borderColor = "#ffd700";
let backgroundColor = "#ffff0033";
let defaultColor = "#f9fafa";

export const PPUndoGraphConfig = () => {
  const SPLIT_PRESSURE_NUM = 20;

  const xLabels: number[] = [...Array(SPLIT_PRESSURE_NUM + 1)].map((_, i) => Math.round((i*(1/SPLIT_PRESSURE_NUM))*100)/100);
  
  const datasets = {
    label: "ストローク数",
    borderColor: borderColor,
    backgroundColor: backgroundColor,
    pointBackgroundColor: defaultColor,
    fill: true,
    smooth: true,
    tension: 0.4,
  }

  const options: {} = {
    plugins: {
      legend:{
        display:false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: defaultColor,
        },
        title: {
          color: defaultColor,
          display: true,
          text: "筆圧値",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: defaultColor+"aa",
        },
        title: {
          color: defaultColor+"aa",
          display: true,
          text: "ストローク数",
        }
      }
    },
  }

  return { SPLIT_PRESSURE_NUM, xLabels, datasets, options }
}
