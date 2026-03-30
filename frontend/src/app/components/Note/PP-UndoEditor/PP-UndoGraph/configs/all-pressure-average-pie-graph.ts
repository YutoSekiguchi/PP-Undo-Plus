export const AllPressureAveragePieGraphConfig = () => {
  const datasets = {
    backgroundColor: ["rgba(139, 92, 246, 0.8)", "rgba(255, 255, 255, 0.06)"],
    borderColor: ["rgba(139, 92, 246, 0.3)", "transparent"],
    borderWidth: 1,
  };

  const graphLabel: string[] = ["Average Pressure", "Remaining"];

  const doughnutOptions: {} = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 15, 20, 0.9)",
        titleColor: "rgba(255, 255, 255, 0.7)",
        bodyColor: "#e4e4e7",
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        bodyFont: {
          family: "'Inter', system-ui, sans-serif",
          size: 12,
        },
      },
    },
    cutout: "78%",
    radius: "90%",
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
    },
  };

  return { datasets, graphLabel, doughnutOptions };
};
