import { useEffect, useState } from "react";
import eventDB from "../scripts/eventsDB";

const hw = 1000;

interface EventList {
  start: Date;
  end: Date;
  drinks: DrinkNames[];
}

interface DrinkNames {
  name: string;
  price: number;
  value: number;
}
function calcSalary(eventData: EventList) {
  var total = 0;
  for (var key in eventData.drinks) {
    total += eventData.drinks[key].price * eventData.drinks[key].value;
  }
  //   時給計算
  const elapsed = eventData.end.getTime() - eventData.start.getTime();
  const elapsedHours = elapsed / (1000 * 60 * 60);
  total += hw * elapsedHours;
  return total;
}

export const Breakdown = ({ startDate }: { startDate: Date }) => {
  const [eventData, setEventData] = useState<EventList | null>(null);
  useEffect(() => {
    setEventData(null);
    setTimeout(() => {
      eventDB.getEventsRecord(startDate).then((result: EventList) => {
        setEventData(result);
      });
    }, 300);
  }, [startDate]);
  return (
    <div className="flex justify-center items-center">
      {eventData ? (
        <div className="flex justify-center items-center flex-col bg-white rounded-lg shadow-lg p-8 w-full">
          <div className="text-2xl font-bold mb-4">
            ￥ {calcSalary(eventData).toLocaleString("ja-JP")}
          </div>
          <div className="border-b border-gray-300 w-full"></div>
          {/* <div className="text-lg font-semibold mt-4">合計金額:</div>
          <div className="text-2xl font-bold mb-4">
            ￥ {calcSalary(eventData).toLocaleString("ja-JP")}
          </div> */}
          <div className="mt-4 w-full">
            <h2 className="text-lg font-semibold mb-2">内訳:</h2>
            <ul>
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
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="mb-4 animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-gray-900"></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};
