import React from "react";
import {
  useAlert,
  useDeducationAmountPercent,
  useDeducationAmountYen,
  useToggle,
  useToggleButton,
  useWage,
} from "../scripts/customhooks";

const hourlyRateKey: string = "hourlyRate";
const deductionAmountPercentKey: string = "deductionAmountPercent";
const bookNominationKey: string = "bookNomination";
const bookNominationBackToggleKey: string = "bookNominationBack";
const hallNominationKey: string = "hallNomination";
const salesBackKey: string = "salesBack";

const HourlyRatePage = () => {
  const { alert, handleAlertOpen } = useAlert();
  const { toggle, handleToggle } = useToggle(
    localStorage.getItem(bookNominationBackToggleKey) === "true"
  );
  // const [hourlyRate, setHourlyRate] = useState(getHourlyRate());
  const { wage: hourlyRate, handleWageChange: handleHourlyRateChange } =
    useWage(
      Number(localStorage.getItem(hourlyRateKey)).toLocaleString("ja-JP") || "0"
    );
  const { deductionAmountYen, handleDeductionAmountYenChange } =
    useDeducationAmountYen();
  const { deductionAmountPercent, handleDeductionAmountPercentChange } =
    useDeducationAmountPercent(localStorage.getItem(deductionAmountPercentKey));
  const {
    deductionAmountPercent: salesBack,
    handleDeductionAmountPercentChange: handleSalesBackChange,
  } = useDeducationAmountPercent(localStorage.getItem(salesBackKey));
  // const [deductionUnit, setDeductionUnit] = useState(getDeductionUnit());
  const { selectedOption, handleOptionClick } = useToggleButton();
  const { wage: bookNomination, handleWageChange: handleBookNominationChange } =
    useWage(
      Number(localStorage.getItem(bookNominationKey)).toLocaleString("ja-JP") ||
        "0"
    );
  const { wage: hallNomination, handleWageChange: handlehallNominationChange } =
    useWage(
      Number(localStorage.getItem(hallNominationKey)).toLocaleString("ja-JP") ||
        "0"
    );

  // const handleDeductionAmountChange = (e: { target: { value: any } }) => {
  //   const inputDeductionAmount = Number(e.target.value.replace(/,/g, ""));
  //   // マイナスの値が入力された場合は、0に設定する
  //   const newDeductionAmount =
  //     inputDeductionAmount < 0 ? 0 : inputDeductionAmount;
  //   localStorage.setItem(deductionAmountKey, String(newDeductionAmount));
  //   setDeductionAmount(newDeductionAmount.toLocaleString("ja-JP"));
  // };

  const handleSubmit = () => {
    handleAlertOpen("設定を保存しました", "");
    localStorage.setItem(
      deductionAmountPercentKey,
      String(deductionAmountPercent)
    );
    localStorage.setItem(hourlyRateKey, hourlyRate.replace(/,/g, ""));
    localStorage.setItem(bookNominationKey, bookNomination.replace(/,/g, ""));
    localStorage.setItem(hallNominationKey, hallNomination.replace(/,/g, ""));
    localStorage.setItem(bookNominationBackToggleKey, String(toggle));
    localStorage.setItem(salesBackKey, String(salesBack));
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 mt-9">
      <div className="bg-white w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-md p-6">
        {alert}
        <h1 className="text-2xl font-semibold mb-4">給与</h1>
        <div className="mb-6">
          <label
            htmlFor="hourlyRate"
            className="block text-sm font-medium text-gray-700"
          >
            時給（円）
          </label>
          <input
            inputMode="numeric"
            pattern="\d*"
            type="text"
            id="hourlyRate"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            placeholder="時給を入力してください"
            value={hourlyRate}
            min="0" // マイナスの値を入力できないようにする
            onChange={handleHourlyRateChange}
          />
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-3">本指名売上バック</span>
            <input
              type="checkbox"
              checked={toggle}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div
              className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 ${
                toggle
                  ? "peer-checked:after:translate-x-full"
                  : "rtl:peer-checked:after:-translate-x-full"
              } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
                toggle ? "peer-checked:bg-blue-600" : ""
              }`}
            ></div>
          </label>
          {toggle ? (
            <div className="flex items-center">
              <input
                inputMode="numeric"
                pattern="\d*"
                type="text"
                id="deductionAmountPercent"
                className="mt-1 block w-3/4 border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="数値"
                value={salesBack}
                onChange={handleSalesBackChange}
              />
              %
            </div>
          ) : null}
        </div>

        <div className="mb-6">
          <label
            htmlFor="bookNomination"
            className="block text-sm font-medium text-gray-700"
          >
            本指名バック（円）
          </label>
          <input
            inputMode="numeric"
            pattern="\d*"
            type="text"
            id="bookNomination"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            placeholder="時給を入力してください"
            value={bookNomination}
            min="0" // マイナスの値を入力できないようにする
            onChange={handleBookNominationChange}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="hallNomination"
            className="block text-sm font-medium text-gray-700"
          >
            場内指名バック（円）
          </label>
          <input
            inputMode="numeric"
            pattern="\d*"
            type="text"
            id="hallNomination"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            placeholder="時給を入力してください"
            value={hallNomination}
            min="0" // マイナスの値を入力できないようにする
            onChange={handlehallNominationChange}
          />
        </div>
        <h1 className="text-2xl font-semibold mb-4">引かれもの</h1>
        <div>
          <label className="block text-sm font-medium text-gray-700 pb-2">
            引かれもの種類
          </label>
          <div className="flex mb-4">
            {/* Option 1 */}
            <button
              className={`flex-1 py-2 px-4 ${
                selectedOption === 0
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              } rounded-l-md focus:outline-none`}
              onClick={() => handleOptionClick(0)}
            >
              %
            </button>
            {/* Option 2 */}
            <button
              className={`flex-1 py-2 px-4 ${
                selectedOption === 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              } focus:outline-none`}
              onClick={() => handleOptionClick(1)}
            >
              円
            </button>
            {/* Option 3 */}
            <button
              className={`flex-1 py-2 px-4 ${
                selectedOption === 2
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              } rounded-r-md focus:outline-none`}
              onClick={() => handleOptionClick(2)}
            >
              両方
            </button>
          </div>
          <div className="">
            <label
              htmlFor="deductionAmountPercent"
              className="block text-sm font-medium text-gray-700"
            >
              引かれもの(%)
            </label>
            <div className="flex items-center">
              <input
                disabled={selectedOption === 1}
                inputMode="numeric"
                pattern="\d*"
                type="text"
                id="deductionAmountPercent"
                className="mt-1 block w-3/4 border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="数値"
                value={selectedOption === 1 ? 0 : deductionAmountPercent}
                onChange={handleDeductionAmountPercentChange}
              />
              %
            </div>
            {/* <div className="relative mb-6">
              <input
                id="default-range"
                type="range"
                defaultValue={selectedOption === 1 ? 0 : deductionAmountPercent}
                onChange={handleDeductionAmountPercentChange}
                className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer range-lg dark:bg-gray-700"
                disabled={selectedOption === 1}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-5">
                0
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/2 -bottom-5">
                50
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 absolute -bottom-5">
                100
              </span>
            </div> */}
          </div>
          <div className="mb-6">
            <label
              htmlFor="deductionAmountYen"
              className="block text-sm font-medium text-gray-700"
            >
              引かれもの(円)
            </label>
            <div className="flex items-center">
              <input
                disabled={selectedOption === 0}
                inputMode="numeric"
                pattern="\d*"
                type="text"
                id="deductionAmountYen"
                className="mt-1 block w-3/4 border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="数値"
                value={selectedOption === 0 ? 0 : deductionAmountYen}
                min="0"
                onChange={handleDeductionAmountYenChange}
              />
              円
            </div>
          </div>
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
