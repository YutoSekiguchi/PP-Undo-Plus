export const PPUndoGraphConfig = () => {
  const SPLIT_PRESSURE_NUM = 20;

  const xLabels: number[] = [...Array(SPLIT_PRESSURE_NUM + 1)].map((_, i) => Math.round((i*(1/SPLIT_PRESSURE_NUM))*100)/100);

  const datasets = {
    label: "Strokes",
    borderColor: "rgba(139, 92, 246, 0.8)",
    backgroundColor: "rgba(139, 92, 246, 0.12)",
    pointBackgroundColor: "rgba(139, 92, 246, 0.9)",
    pointBorderColor: "rgba(139, 92, 246, 0.4)",
    pointRadius: 2.5,
    pointHoverRadius: 5,
    borderWidth: 2,
    fill: true,
    smooth: true,
    tension: 0.4,
  }

  const options: {} = {
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
    maintainAspectRatio: true,
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.04)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.3)",
          font: {
            family: "'Inter', system-ui, sans-serif",
            size: 10,
          },
          maxTicksLimit: 6,
        },
        title: {
          color: "rgba(255, 255, 255, 0.35)",
          display: true,
          text: "Pressure",
          font: {
            family: "'Inter', system-ui, sans-serif",
            size: 11,
            weight: "500",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.04)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.3)",
          font: {
            family: "'Inter', system-ui, sans-serif",
            size: 10,
          },
        },
        title: {
          color: "rgba(255, 255, 255, 0.35)",
          display: true,
          text: "Strokes",
          font: {
            family: "'Inter', system-ui, sans-serif",
            size: 11,
            weight: "500",
          },
        }
      }
    },
  }

  return { SPLIT_PRESSURE_NUM, xLabels, datasets, options }
}
