import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import eventDB from "../scripts/eventsDB";
import { MonthlyBreakDown } from "./MonthlyBreakDown";
import {
  floorNum,
  floorWage,
  getBookNominationBack,
} from "../scripts/customhooks";

interface EventData {
  start: Date;
  end: Date;
  drinks: {
    name: string;
    price: number;
    value: number;
    bookNomination: number;
    hallNomination: number;
  }[];
}
const deductionAmountYenKey: string = "deductionAmountYen";
const deductionAmountPercentKey: string = "deductionAmountPercent";
const deductionAmountOptionKey: string = "deductionAmountOption";
const salesBackOptionKey: string = "bookNominationBack";

function loadEventIndexedDB(date: Date, cutoffDate: number) {
  var monthlyEventData: EventData[] = [];
  var oneMonthAgo: Date;
  var endDate = new Date(date.getFullYear(), date.getMonth(), cutoffDate);
  endDate.setDate(endDate.getDate() + 1);
  if (date.getMonth() === 0) {
    oneMonthAgo = new Date(
      date.getFullYear() - 1,
      11, // 12月
      cutoffDate
    );
  } else if (cutoffDate === 32) {
    oneMonthAgo = new Date(date.getFullYear(), date.getMonth(), 0);
    endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  } else {
    oneMonthAgo = new Date(date.getFullYear(), date.getMonth() - 1, cutoffDate);
  }
  oneMonthAgo.setDate(oneMonthAgo.getDate() + 1);
  return eventDB.getAllEventsRecord().then((result: any) => {
    for (var key in result) {
      var startDate: Date = new Date(result[key].start);
      if (startDate >= oneMonthAgo && startDate < endDate) {
        monthlyEventData.push(result[key]);
      }
    }
    return monthlyEventData;
  });
}

function getDeduction(salary: number) {
  var result: number = 0;
  var deductionAmountYen = localStorage.getItem(deductionAmountYenKey);
  var deductionAmountPercent = localStorage.getItem(deductionAmountPercentKey);
  var deductionAmountOption = localStorage.getItem(deductionAmountOptionKey);
  if (deductionAmountOption === "0") {
    result = (salary * Number(deductionAmountPercent)) / 100;
  } else if (deductionAmountOption === "1") {
    result = Number(deductionAmountYen);
  } else {
    result =
      (salary * Number(deductionAmountPercent)) / 100 +
      Number(deductionAmountYen);
  }
  return Math.floor(result);
}

const MonthlySalaryPage = ({ cutoffDate }: { cutoffDate: number }) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState({
    totalSalary: 0,
    totalHourlyWage: 0,
    totalDeduction: 0,
    workingHours: 0,
    drinkSales: 0,
    totalNomination: 0,
    totalBookNomination: 0,
    totalHallNomination: 0,
    totalSalesBack: 0,
  });
  const [eventData, setEventData] = useState<EventData[]>([]);
  useEffect(() => {
    loadEventIndexedDB(selectedDate, cutoffDate).then((result: any) => {
      setEventData(result);
      var totalSalary = 0;
      var hourlyWage = Number(localStorage.getItem("hourlyRate"));
      let bookNomination = Number(localStorage.getItem("bookNomination"));
      let hallNomination = Number(localStorage.getItem("hallNomination"));
      var workingHours = 0;
      var drinkSales = 0;
      var totalDeduction = 0;
      var totalHourlyWage = 0;
      var totalNomination = 0;
      var totalBookNomination = 0;
      var totalSalesBack = 0;
      var totalHallNomination = 0;
      for (var key in result) {
        var dailySalary = 0;
        var dailyNomination = 0;
        var dailyDrinkSales = 0;
        var dailySales: number[] = [];
        var elapsed =
          new Date(result[key].end).getTime() -
          new Date(result[key].start).getTime();
        var elapsedHours = elapsed / (1000 * 60 * 60);
        workingHours += elapsedHours;
        for (var key2 in result[key].drinks) {
          dailyDrinkSales +=
            result[key].drinks[key2].price * result[key].drinks[key2].value;
        }
        dailySales = result[key].sales;
        dailyNomination += result[key].bookNomination * bookNomination;
        dailyNomination += result[key].hallNomination * hallNomination;
        totalBookNomination += result[key].bookNomination;
        totalHallNomination += result[key].hallNomination;

        dailySalary += dailyNomination;
        dailySalary += elapsedHours * hourlyWage;
        dailySalary += dailyDrinkSales;
        let dailySalesBack =
          localStorage.getItem(salesBackOptionKey) === "true"
            ? getBookNominationBack(dailySales)
            : 0;
        dailySalary += dailySalesBack;
        var deduction = getDeduction(dailySalary);
        totalDeduction += deduction;
        totalSalary += dailySalary;
        totalSalary -= deduction;
        totalSalesBack += dailySalesBack;
        totalNomination += dailyNomination;
        drinkSales += dailyDrinkSales;
        totalHourlyWage += elapsedHours * hourlyWage;
      }

      // totalHourlyWage = hourlyWage * workingHours;
      setMonthlyData({
        totalSalary: totalSalary,
        totalHourlyWage: totalHourlyWage,
        totalDeduction: totalDeduction,
        workingHours: workingHours,
        drinkSales: drinkSales,
        totalNomination: totalNomination,
        totalBookNomination: totalBookNomination,
        totalHallNomination: totalHallNomination,
        totalSalesBack: totalSalesBack,
      });
    });
  }, [cutoffDate, selectedDate]);

  // 円グラフのデータ
  const chartData = {
    labels: ["時給", "ドリンク", "指名"],
    datasets: [
      {
        data: [
          monthlyData.totalHourlyWage,
          monthlyData.drinkSales,
          monthlyData.totalNomination,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  function handleLeftButtonClick(): void {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  }

  function handleRightButtonClick(): void {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  }

  const handleBreakDown = () => {
    setOpen(true);
  };
  return (
    <>
      <MonthlyBreakDown
        open={open}
        setOpen={setOpen}
        salary={monthlyData.totalSalary}
        workTime={monthlyData.workingHours}
        eventData={eventData}
        deducation={monthlyData.totalDeduction}
        bookNomination={monthlyData.totalBookNomination}
        hallNomination={monthlyData.totalHallNomination}
        totalSales={monthlyData.totalSalesBack}
      />
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
        <p className="text-center mt-8 text-2xl font-bold">
          合計給与: ￥{floorWage(monthlyData.totalSalary).toLocaleString()}
        </p>
      </div>
      {/* 画面下部 */}
      <div className="mt-10 w-full lg:w-3/4 xl:w-1/2 bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-sm text-gray-600">勤務時間</p>
            <p className="font-semibold">
              {floorNum(monthlyData.workingHours, 2)} 時間
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">時給</p>
            <p className="font-semibold">
              ￥{floorWage(monthlyData.totalHourlyWage).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">ドリンク料</p>
            <p className="font-semibold">
              ￥{floorWage(monthlyData.drinkSales).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">指名料</p>
            <p className="font-semibold">
              ￥{floorWage(monthlyData.totalNomination).toLocaleString()}
            </p>
          </div>
          {/* <div className="text-center">
            <p className="text-sm text-red-500">引かれもの</p>
            <p className="font-semibold text-red-700">
              - ￥{monthlyData.totalDeduction.toLocaleString()}
            </p>
          </div> */}
        </div>
        {/* 詳細を表示ボタン */}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={handleBreakDown}
        >
          詳細を表示
        </button>
      </div>
    </>
  );
};

export default MonthlySalaryPage;
