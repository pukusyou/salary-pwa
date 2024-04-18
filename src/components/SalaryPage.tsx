import React from "react";
import "chart.js/auto";
import MonthlySalaryPage from "./MonthlySalaryPage";
import MonthlySalaryTwoPage from "./MonthlySalaryTwoPage";
// import YearlySalaryPage from "./YearlySalaryPage";

const SalaryPage = () => {
  //   const [selectedOption, setSelectedOption] = useState(1);
  let string = localStorage.getItem("cutoffDates");
  let cutoffDates = string ? JSON.parse(string) : [];
  // 配列の要素を数値に変換
  cutoffDates = cutoffDates.map((date: string) => Number(date));
  // 昇順にソート
  cutoffDates.sort((a: number, b: number) => a - b);
  return (
    <div className="flex flex-col items-center p-4">
      {/* 画面上部 */}
      {/* <div className="min-w-full mt-0 mb-2 border-2 rounded-lg border-blue-500"> */}
      {/* <div className="flex justify-between">
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
        </div> */}
      {/* </div> */}
      {/* {selectedOption === 1 ? <MonthlySalaryPage /> : <YearlySalaryPage />} */}

      {cutoffDates.length === 1 ? (
        <MonthlySalaryPage cutoffDate={cutoffDates[0]} />
      ) : (
        <MonthlySalaryTwoPage cutoffDates={cutoffDates} />
      )}
    </div>
  );
};

export default SalaryPage;
