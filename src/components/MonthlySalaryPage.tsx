import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
const MonthlySalaryPage = () => {
  // 仮のデータ
  const monthlyData = {
    year: 2024,
    month: "2月",
    totalSalary: 150000,
    hourlyWage: 1000,
    drinkIncome: 50000,
    workingHours: 120,
    drinkSales: 50,
  };

  // 円グラフのデータ
  const chartData = {
    labels: ["時給", "ドリンク"],
    datasets: [
      {
        data: [monthlyData.hourlyWage, monthlyData.drinkIncome],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* 画面上部 */}
      <h1 className="text-2xl font-semibold mb-4">
        {monthlyData.year}年{monthlyData.month}度
      </h1>
      {/* 画面の半分に円グラフを表示 */}
      <div className="w-full lg:w-3/4 xl:w-1/2">
        <Doughnut data={chartData} height={200} width={200} />
        <p className="text-center mt-2">
          合計給与: ￥{monthlyData.totalSalary.toLocaleString()}
        </p>
      </div>
      {/* 画面下部 */}
      <div className="mt-4 w-full lg:w-3/4 xl:w-1/2">
        <div className="flex justify-between">
          <p>勤務時間: {monthlyData.workingHours} 時間</p>
          <p>給与: ￥{monthlyData.totalSalary.toLocaleString()}</p>
          <p>ドリンク料: ￥{monthlyData.drinkSales.toLocaleString()}</p>
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
