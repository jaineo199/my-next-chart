import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  LogarithmicScale,
} from "chart.js";
import { Bubble } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import BubbleChartMainData from "../Data/bubbleChartMainData.json";

ChartJS.defaults.borderColor = "rgba(243,243,243,0.50)";
ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  LogarithmicScale,
  annotationPlugin
);

export default function App() {
  const [mainData, setMainData] = useState<any>(null);
  const [targetData, setTargetData] = useState<any>(null);

  const options: any = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";

            if (label) {
              const tooltipText = [];
              tooltipText.push(`Campaign Name: ${context.raw.name}`);
              tooltipText.push(`Revenue: ${context.raw.x}`);
              tooltipText.push(`CPP: ${context.raw.y}`);
              return tooltipText;
            }
          },
        },
        backgroundColor: "#000000",
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: 20,
            yMax: 20,
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 2,
            label: {
              display: true,
              backgroundColor: "green",
              drawTime: "afterDatasetsDraw",
              content: `Target CPP: ${targetData}`,
            },
            enter({ element }: any, event: any) {
              element.label.options.display = true;
              return true; // force update
            },
            leave({ element }: any, event: any) {
              element.label.options.display = false;
              return true;
            },
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "logarithmic",
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Revenue",
          color: "#000000",
          font: {
            size: 20,
          },
        },
        ticks: {
          callback: function (value: any, index: any, values: any) {
            return index === 0 || index === values.length - 1 ? value : "";
          },
        },
      },
      y: {
        type: "logarithmic",
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "CPP",
          color: "#000000",
          font: {
            size: 20,
          },
        },
        ticks: {
          callback: function (value: any, index: any, values: any) {
            return index === 0 || index === values.length - 1 ? value : "";
          },
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: "Red dataset",
        data: mainData?.map((item: any) => {
          return {
            x: item.fa_revenue,
            y: item.fa_cpp,
            r: item.cost,
            name: item.campaign_name,
          };
        }),
        backgroundColor: mainData?.map((item: any) => {
          if (item.fa_cpp < item.cpp_target) {
            return "#f01d4a";
          } else {
            return "#1df03c";
          }
        }),
      },
    ],
  };

  useEffect(() => {
    const filtertedCostDataIfZero =
      BubbleChartMainData.data.ProData.this_period.filter(
        (item) => item.cost !== 0
      );

    const costs = filtertedCostDataIfZero.map((item) => item.cost);
    const maxCost = Math.max(...costs);
    const minCost = Math.min(...costs);

    const normalizedData = filtertedCostDataIfZero.map((item) => ({
      ...item,
      cost: ((item.cost - minCost) / (maxCost - minCost)) * 100,
    }));

    setTargetData(normalizedData[0].cpp_target);

    setMainData(normalizedData);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Bubble
        options={options}
        data={data}
        style={{
          width: "95%",
          height: "95%",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "15px",
          backgroundColor: "rgba(243,243,243,0.50)",
        }}
      />
    </div>
  );
}
