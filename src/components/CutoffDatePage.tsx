import React, { useState } from "react";
import { useAlert } from "../scripts/customhooks";

const CutoffDatePage = () => {
  const { alert, handleAlertOpen } = useAlert();
  const [selectedDay, setSelectedDay] = useState(
    localStorage.getItem("cutoffDate") || "-1"
  );

  const handleDayChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    if (Number(e.target.value) >= 0) {
      localStorage.setItem("cutoffDate", String(e.target.value));
      setSelectedDay(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (selectedDay === "-1") {
      handleAlertOpen("締め日を選択してください", "");
      return;
    } else {
      handleAlertOpen("設定しました", "");
    }
  };

  return (
    <div className="flex items-center justify-center mt-9 bg-gray-100">
      <div className="bg-white w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-md p-6">
        {alert}
        <h1 className="text-2xl font-semibold mb-4">締め日設定</h1>
        <div className="mb-6">
          <label
            htmlFor="cutoffDate"
            className="block text-sm font-medium text-gray-700"
          >
            締め日を選択してください
          </label>
          <select
            id="cutoffDate"
            value={selectedDay}
            onChange={handleDayChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={-1}>選択してください</option>
            {[...Array(30)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}日
              </option>
            ))}
            <option value={0}>月末</option>
          </select>
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

export default CutoffDatePage;
