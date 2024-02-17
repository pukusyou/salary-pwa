import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import eventDB from "../scripts/eventsDB";

interface EventData {
  start: Date;
  end: Date;
  drinks: {
    name: string;
    price: number;
    value: number;
  }[];
}

function loadEventIndexedDB(date: Date) {
  var monthlyEventData: EventData[] = [];
  var cutoffDate = Number(localStorage.getItem("cutoffDate"));
  var oneMonthAgo = new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    cutoffDate
  );
  var endDate = new Date(date.getFullYear(), date.getMonth(), cutoffDate);
  return eventDB.getAllEventsRecord().then((result: any) => {
    for (var key in result) {
      var startDate: Date = new Date(result[key].start);
      if (startDate > oneMonthAgo && startDate <= endDate) {
        monthlyEventData.push(result[key]);
      }
    }
    return monthlyEventData;
  });
}

const MonthlySalaryPage = () => {
  const [selectedOption, setSelectedOption] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState({
    totalSalary: 0,
    totalHourlyWage: 0,
    workingHours: 0,
    drinkSales: 0,
  });
  useEffect(() => {
    loadEventIndexedDB(selectedDate).then((result: any) => {
      var totalSalary = 0;
      var hourlyWage = Number(localStorage.getItem("hourlyRate"));
      var workingHours = 0;
      var drinkSales = 0;
      var totalHourlyWage = 0;
      for (var key in result) {
        var elapsed =
          new Date(result[key].end).getTime() -
          new Date(result[key].start).getTime();
        var elapsedHours = elapsed / (1000 * 60 * 60);
        workingHours += elapsedHours;
        for (var key2 in result[key].drinks) {
          drinkSales += result[key].drinks[key2].price;
        }
        totalSalary += elapsedHours * hourlyWage;
      }
      totalSalary += drinkSales;
      totalHourlyWage = hourlyWage * workingHours;
      setMonthlyData({
        totalSalary: totalSalary,
        totalHourlyWage: totalHourlyWage,
        workingHours: workingHours,
        drinkSales: drinkSales,
      });
    });
  }, [selectedDate]);

  // 円グラフのデータ
  const chartData = {
    labels: ["時給", "ドリンク"],
    datasets: [
      {
        data: [monthlyData.totalHourlyWage, monthlyData.drinkSales],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  function handleLeftButtonClick(): void {
    const newDate = new Date(selectedDate);
    if (selectedOption === 1) {
      newDate.setMonth(newDate.getMonth() - 1);
      console.log(newDate.toLocaleDateString());
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setSelectedDate(newDate);
  }

  function handleRightButtonClick(): void {
    const newDate = new Date(selectedDate);
    if (selectedOption === 1) {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setSelectedDate(newDate);
  }

  return (
    <div className="flex flex-col items-center p-4">
      {/* 画面上部 */}
      <div className="min-w-full mt-0 mb-2">
        <div className="flex justify-between">
          <button
            className={`flex-1 ${
              selectedOption === 1
                ? "bg-blue-500 text-white"
                : "bg-transparent text-blue-500"
            } py-1 px-3 rounded-l-md focus:outline-none focus:bg-blue-600 hover:bg-blue-600`}
            onClick={() => setSelectedOption(1)}
          >
            月
          </button>
          <button
            className={`flex-1 ${
              selectedOption === 2
                ? "bg-blue-500 text-white"
                : "bg-transparent text-blue-500"
            } py-1 px-3 rounded-r-md focus:outline-none focus:bg-blue-600 hover:bg-blue-600`}
            onClick={() => setSelectedOption(2)}
          >
            年
          </button>
        </div>
      </div>
      <div className="flex items-center mr-4">
        <button
          className="hover:text-blue-600"
          onClick={() => handleLeftButtonClick()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold m-1">
          {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}
          月度
        </h1>
        <button
          className="hover:text-blue-600"
          onClick={() => handleRightButtonClick()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 ml-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
      {/* 画面の半分に円グラフを表示 */}
      <div className="w-full lg:w-3/4 xl:w-1/2 max-w-min mt-1">
        <Doughnut data={chartData} height={500} width={500} />

        <p className="text-center mt-8">
          合計給与: ￥{monthlyData.totalSalary.toLocaleString()}
        </p>
      </div>
      {/* 画面下部 */}
      <div className="mt-10 w-full lg:w-3/4 xl:w-1/2 bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-sm text-gray-600">勤務時間</p>
            <p className="font-semibold">{monthlyData.workingHours} 時間</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">給与</p>
            <p className="font-semibold">
              ￥{monthlyData.totalSalary.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">ドリンク料</p>
            <p className="font-semibold">
              ￥{monthlyData.drinkSales.toLocaleString()}
            </p>
          </div>
        </div>
        {/* 詳細を表示ボタン */}
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          詳細を表示
        </button>
      </div>
    </div>
  );
};

export default MonthlySalaryPage;
