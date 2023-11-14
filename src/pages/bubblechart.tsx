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
import BubbleChartOneData from "../Data/bubbleChartOneData.json";
import BubbleChartThreeData from "../Data/bubbleChartThreeData.json";
import BubbleChartMainData from "../Data/bubbleChartMainData.json";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, LogarithmicScale);

export default function App() {
  const [mainData, setMainData] = useState<any>(null);

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
      legend: {
        display: false,
        // position: "bottom",
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
            // Display first, quarter, middle, three-quarter and last label
            return index === 0 ||
              // index === Math.floor(values.length / 4) ||
              // index === Math.floor(values.length / 2) ||
              // index === Math.floor((3 * values.length) / 4) ||
              index === values.length - 1
              ? value
              : "";
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
            // Display first, quarter, middle, three-quarter and last label
            return index === 0 ||
              // index === Math.floor(values.length / 4) ||
              // index === Math.floor(values.length / 2) ||
              // index === Math.floor((3 * values.length) / 4) ||
              index === values.length - 1
              ? value
              : "";
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

      // {
      //   label: "Target",
      //   data: BubbleChartThreeData,
      //   backgroundColor: "#c0ccc2",
      // },
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
