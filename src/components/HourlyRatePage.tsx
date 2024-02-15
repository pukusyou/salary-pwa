import React, { useState } from "react";

const hourlyRateKey: string = "hourlyRate";
const transportationCostKey: string = "transportationCost";

function getHourlyRate() {
  var hourlyRate = localStorage.getItem(hourlyRateKey);
  if (hourlyRate) {
    return Number(hourlyRate).toLocaleString("ja-JP");
  } else {
    return "";
  }
}

function getTransportationCost() {
  var hourlyRate = localStorage.getItem(transportationCostKey);
  if (hourlyRate) {
    return Number(hourlyRate).toLocaleString("ja-JP");
  } else {
    return "";
  }
}

const HourlyRatePage = () => {
  const [hourlyRate, setHourlyRate] = useState(getHourlyRate());
  const [dailyTransportationCost, setDailyTransportationCost] = useState(
    getTransportationCost()
  );
  const handleHourlyRateChange = (e: { target: { value: any } }) => {
    const inputHourlyRate = Number(e.target.value.replace(/,/g, ""));
    // マイナスの値が入力された場合は、0に設定する
    const newHourlyRate = inputHourlyRate < 0 ? 0 : inputHourlyRate;
    localStorage.setItem(hourlyRateKey, String(newHourlyRate));
    console.log(newHourlyRate.toLocaleString("ja-JP"));
    setHourlyRate(newHourlyRate.toLocaleString("ja-JP"));
  };

  const handleDailyTransportationCostChange = (e: {
    target: { value: any };
  }) => {
    const inputDailyTransportationCost = Number(
      e.target.value.replace(/,/g, "")
    );
    // マイナスの値が入力された場合は、0に設定する
    const newDailyTransportationCost =
      inputDailyTransportationCost < 0 ? 0 : inputDailyTransportationCost;
    localStorage.setItem(
      transportationCostKey,
      String(newDailyTransportationCost)
    );
    setDailyTransportationCost(
      inputDailyTransportationCost.toLocaleString("ja-JP")
    );
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">時給設定</h1>
        <div className="mb-6">
          <label
            htmlFor="hourlyRate"
            className="block text-sm font-medium text-gray-700"
          >
            時給（円）
          </label>
          <input
            type="text"
            id="hourlyRate"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            placeholder="時給を入力してください"
            value={hourlyRate}
            min="0" // マイナスの値を入力できないようにする
            onChange={handleHourlyRateChange}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="dailyTransportationCost"
            className="block text-sm font-medium text-gray-700"
          >
            交通費（1日）（円）
          </label>
          <input
            type="text"
            id="dailyTransportationCost"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            placeholder="交通費（1日）を入力してください"
            value={dailyTransportationCost}
            min="0" // マイナスの値を入力できないようにする
            onChange={handleDailyTransportationCostChange}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={() =>
              console.log(
                `Hourly rate set to: ${hourlyRate}, Daily transportation cost set to: ${dailyTransportationCost}`
              )
            }
          >
            設定
          </button>
        </div>
      </div>
    </div>
  );
};

export default HourlyRatePage;
