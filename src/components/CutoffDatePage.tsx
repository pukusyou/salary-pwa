import React, { useState } from "react";
import { useAlert } from "../scripts/customhooks";

const CutoffDatePage = () => {
  const { alert, handleAlertOpen } = useAlert();
  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    const storedDates = localStorage.getItem("cutoffDates");
    return storedDates ? JSON.parse(storedDates) : [];
  });

  const handleDayChange = (day: string) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day].slice(0, 2); // Maximum of 2 dates
    localStorage.setItem("cutoffDates", JSON.stringify(updatedDays));
    setSelectedDays(updatedDays);
  };

  const handleSubmit = () => {
    if (selectedDays.length === 0) {
      handleAlertOpen("少なくとも1つの締め日を選択してください", "");
    } else {
      handleAlertOpen("保存しました", "");
    }
  };

  return (
    <div className="flex items-center justify-center mt-9 bg-gray-100">
      <div className="bg-white w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-md p-6">
        {alert}
        <h1 className="text-2xl font-semibold mb-4">締め日設定</h1>
        <div className="mb-6">
          {[...Array(30)].map((_, i) => (
            <button
              key={i + 1}
              className={`m-1 p-2 ${
                selectedDays.includes(String(i + 1))
                  ? "bg-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleDayChange(String(i + 1))}
            >
              {i + 1}日
            </button>
          ))}
          <button
            className={`m-1 p-2 ${
              selectedDays.includes("32") ? "bg-blue-500" : "bg-gray-200"
            }`}
            onClick={() => handleDayChange("32")}
          >
            月末
          </button>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default CutoffDatePage;
