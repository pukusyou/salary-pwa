import React, { useState } from "react";

const hourlyRateKey: string = "hourlyRate";
const deductionAmountKey: string = "deductionAmount";
const deductionUnitKey: string = "deductionUnit";

function getHourlyRate() {
  var hourlyRate = localStorage.getItem(hourlyRateKey);
  if (hourlyRate) {
    return Number(hourlyRate).toLocaleString("ja-JP");
  } else {
    return "";
  }
}

function getDeductionAmount() {
  var deductionAmount = localStorage.getItem(deductionAmountKey);
  if (deductionAmount) {
    return Number(deductionAmount).toLocaleString("ja-JP");
  } else {
    return "";
  }
}

function getDeductionUnit() {
  var deductionUnit = localStorage.getItem(deductionUnitKey);
  if (deductionUnit) {
    return deductionUnit;
  } else {
    return "%";
  }
}

const HourlyRatePage = () => {
  const [alert, setAlert] = useState(<></>);
  const [hourlyRate, setHourlyRate] = useState(getHourlyRate());
  const [deductionAmount, setDeductionAmount] = useState(getDeductionAmount());
  const [deductionUnit, setDeductionUnit] = useState(getDeductionUnit());
  const handleHourlyRateChange = (e: { target: { value: any } }) => {
    const inputHourlyRate = Number(e.target.value.replace(/,/g, ""));
    // マイナスの値が入力された場合は、0に設定する
    const newHourlyRate = inputHourlyRate < 0 ? 0 : inputHourlyRate;
    localStorage.setItem(hourlyRateKey, String(newHourlyRate));
    setHourlyRate(newHourlyRate.toLocaleString("ja-JP"));
  };

  const handleDeductionAmountChange = (e: { target: { value: any } }) => {
    const inputDeductionAmount = Number(e.target.value.replace(/,/g, ""));
    // マイナスの値が入力された場合は、0に設定する
    const newDeductionAmount =
      inputDeductionAmount < 0 ? 0 : inputDeductionAmount;
    localStorage.setItem(deductionAmountKey, String(newDeductionAmount));
    setDeductionAmount(newDeductionAmount.toLocaleString("ja-JP"));
  };

  const handleDeductionUnitChange = (e: { target: { value: any } }) => {
    localStorage.setItem(deductionUnitKey, e.target.value);
    setDeductionUnit(e.target.value);
  };

  const handleSubmit = () => {
    if (
      deductionUnit === "%" &&
      Number(deductionAmount.replace(/,/g, "")) > 100
    ) {
      setAlert(
        <div className="flex text-red-700 bg-red-100 border border-red-400 rounded px-2 py-0 mt-4">
          引かれものは100%以内で指定してください
        </div>
      );
    } else {
      setAlert(
        <div className="flex bg-blue-100 border border-blue-500 text-blue-700 rounded px-2 py-0 mt-4">
          保存しました
        </div>
      );
    }
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
            htmlFor="deductionAmount"
            className="block text-sm font-medium text-gray-700"
          >
            引かれもの
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="deductionAmount"
              className="mt-1 block w-3/4 border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
              placeholder="数値"
              value={deductionAmount}
              min="0"
              onChange={handleDeductionAmountChange}
            />
            <select
              className="mt-1 block w-1/4 border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
              value={deductionUnit}
              onChange={handleDeductionUnitChange}
            >
              <option value="%">%</option>
              <option value="円">円</option>
            </select>
          </div>
          {alert}
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={handleSubmit}
          >
            設定
          </button>
        </div>
      </div>
    </div>
  );
};

export default HourlyRatePage;
