export const AllPressureAveragePieGraphConfig = () => {
  const datasets = {
    backgroundColor: ["#fffa", "rgba(0, 0, 0, 0.8)"],
    // borderColor: "#0fa3",
  };

  const graphLabel: string[] = ["今までの筆圧の平均", "None"];

  const doughnutOptions: {} = {
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: 45,
    radius: "90%",
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
    },
  };

  return { datasets, graphLabel, doughnutOptions };
};
