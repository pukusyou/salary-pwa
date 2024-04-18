import { useEffect, useState } from "react";
import eventDB from "../scripts/eventsDB";
import EditDateDrawer from "./EditDateDrawer";
import { getBookNominationBack } from "../scripts/customhooks";

const hourlyRateKey: string = "hourlyRate";
const deductionAmountYenKey: string = "deductionAmountYen";
const deductionAmountPercentKey: string = "deductionAmountPercent";
const deductionAmountOptionKey: string = "deductionAmountOption";
const salesBackKey: string = "salesBack";
const salesBackOptionKey: string = "bookNominationBack";

interface EventList {
  start: Date;
  end: Date;
  drinks: DrinkNames[];
  bookNomination: number;
  hallNomination: number;
  sales: number[];
}

interface DrinkNames {
  name: string;
  price: number;
  value: number;
}

function calcSalary(eventData: EventList) {
  var total = 0;
  var deductionAmountYen = localStorage.getItem(deductionAmountYenKey) || "0";
  var deductionAmountPercent =
    localStorage.getItem(deductionAmountPercentKey) || "0";
  var deductionAmountOption = localStorage.getItem(deductionAmountOptionKey);
  total += calcPlusSalary(eventData);
  //   引かれもの

  if (deductionAmountOption === "0") {
    total -= Math.floor(
      (total * Number.parseFloat(deductionAmountPercent)) / 100
    );
  } else if (deductionAmountOption === "1") {
    total -= Number(deductionAmountYen);
  } else {
    total -=
      Math.floor((total * Number(deductionAmountPercent)) / 100) +
      Number(deductionAmountYen);
  }
  return Math.floor(total);
}

function calcPlusSalary(eventData: EventList) {
  var total = 0;
  for (var key in eventData.drinks) {
    total += eventData.drinks[key].price * eventData.drinks[key].value;
  }
  //   時給計算
  const elapsed = eventData.end.getTime() - eventData.start.getTime();
  const elapsedHours = elapsed / (1000 * 60 * 60);
  total += Number(localStorage.getItem(hourlyRateKey)) * elapsedHours;
  //   指名料
  total +=
    Number(localStorage.getItem("bookNomination")) * eventData.bookNomination +
    Number(localStorage.getItem("hallNomination")) * eventData.hallNomination;

  //   本指名売上バック
  total += getBookNominationBack(eventData.sales);
  return total;
}

// /**
//  * 本指名売上バック
//  * @param sales 会計のリスト
//  * @returns 本指名売上バックの合計
//  */
// function getBookNominationBack(sales: number[]){
//   const salesBack = localStorage.getItem(salesBackKey) || "0";
//   const salesSum = sales.reduce((a, b) => a + b, 0);
//   return Math.floor(salesSum * parseFloat(salesBack)/100);
// }

function getDeduction(eventData: EventList) {
  var result: String = "";
  var deductionAmountYen = localStorage.getItem(deductionAmountYenKey);
  var deductionAmountPercent = localStorage.getItem(deductionAmountPercentKey);
  var deductionAmountOption = localStorage.getItem(deductionAmountOptionKey);

  if (deductionAmountOption === "0") {
    result =
      "￥-" +
      Math.floor(
        (calcPlusSalary(eventData) * Number(deductionAmountPercent)) / 100
      ).toLocaleString("ja-JP");
  } else if (deductionAmountOption === "1") {
    result = "￥ -" + Number(deductionAmountYen).toLocaleString("ja-JP");
  } else {
    result =
      "￥ -" +
      (
        Math.floor(
          (calcPlusSalary(eventData) * Number(deductionAmountPercent)) / 100
        ) + Number(deductionAmountYen)
      ).toLocaleString("ja-JP");
  }
  return result;
}

export const Breakdown = ({
  startDate,
  setEventStart,
  setDrawerOpen,
}: {
  startDate: Date;
  setEventStart: Function;
  setDrawerOpen: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [eventData, setEventData] = useState<EventList | null>(null);
  useEffect(() => {
    setEventData(null);
    setTimeout(() => {
      eventDB.getEventsRecord(startDate).then((result: EventList) => {
        setEventData(result);
      });
    }, 300);
  }, [startDate]);

  const handleDelete = () => {
    eventDB.deleteEventsRecord(startDate).then(() => {
      setEventData(null);
      setDrawerOpen(false);
    });
  };

  return (
    <>
      {open && eventData ? (
        <EditDateDrawer
          date={eventData.start}
          setOpen={setOpen}
          setNewStartDate={setEventStart}
        />
      ) : (
        <div className="flex justify-center items-center">
          {eventData ? (
            <div className="flex justify-center items-center flex-col bg-white rounded-lg shadow-lg p-8 w-full">
              <div className="text-2xl font-bold mb-4">
                ￥ {calcSalary(eventData).toLocaleString("ja-JP")}
              </div>
              <div className="border-b border-gray-300 w-full"></div>
              <div className="mt-4 w-full">
                <h2 className="text-lg font-semibold mb-2">内訳:</h2>
                <ul>
                  <li className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span>時給</span>
                    <span className="text-right">
                      {(
                        (eventData.end.getTime() - eventData.start.getTime()) /
                        (1000 * 60 * 60)
                      ).toFixed(1)}
                      時間 x ￥
                      {Number(
                        localStorage.getItem(hourlyRateKey)
                      ).toLocaleString("ja-JP")}
                    </span>
                  </li>
                  {eventData.bookNomination > 0 ? (
                    <li className="flex justify-between items-center py-2 border-b border-gray-300">
                      <span>本指名</span>
                      <span className="text-right">
                        {eventData.bookNomination} x ￥{" "}
                        {Number(
                          localStorage.getItem("bookNomination")
                        ).toLocaleString("ja-JP")}
                      </span>
                    </li>
                  ) : null}
                  {localStorage.getItem(salesBackOptionKey) === "true" &&
                  eventData.bookNomination > 0 ? (
                    <li className="flex justify-between items-center py-2 border-b border-gray-300">
                      <span>本指名売上バック</span>
                      <span className="text-right">
                        {localStorage.getItem(salesBackKey)} % ￥{" "}
                        {getBookNominationBack(eventData.sales).toLocaleString(
                          "ja-JP"
                        )}
                      </span>
                    </li>
                  ) : null}
                  {eventData.hallNomination > 0 ? (
                    <li className="flex justify-between items-center py-2 border-b border-gray-300">
                      <span>場内指名</span>
                      <span className="text-right">
                        {eventData.hallNomination} x ￥{" "}
                        {Number(
                          localStorage.getItem("hallNomination")
                        ).toLocaleString("ja-JP")}
                      </span>
                    </li>
                  ) : null}
                  {eventData.drinks.map((drink, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-300"
                    >
                      <span>{drink.name}</span>
                      <span className="text-right">
                        {drink.value} x ￥{drink.price.toLocaleString("ja-JP")}
                      </span>
                    </li>
                  ))}
                  <li className="flex text-red-700 justify-between items-center py-2 border-b border-gray-300">
                    <span>引かれもの</span>
                    <span className="text-right">
                      {getDeduction(eventData)}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 w-full">
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">働いた時間帯:</h2>
                  <p>{eventData.start.toLocaleString("ja-JP")}</p>
                  <p>~</p>
                  <p>{eventData.end.toLocaleString("ja-JP")}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-lg"
              >
                編集
              </button>
              <button
                onClick={handleDelete}
                className="absolute top-14 left-4 bg-red-500 hover:bg-red-800 text-white px-2 py-1 rounded-lg"
              >
                削除
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-4 animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-gray-900"></div>
              <p>Loading...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
