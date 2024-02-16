import { useEffect, useState } from "react";
import drinkDB from "../scripts/drinksDB";
import eventDB from "../scripts/eventsDB";
import { Breakdown } from "./Breakdown";
interface Drink {
  name: string;
  price: number;
}

interface DrinkNames {
  name: string;
  value: number;
}

interface EventDrinks {
  name: string;
  price: number;
  value: number;
}

interface EventList {
  start: Date;
  end: Date;
  drinks: EventDrinks[];
}

function loadDrinkIndexedDB() {
  return drinkDB.getAllDrinksRecord().then((result: any) => {
    return result;
  });
}

function loadEventIndexedDB() {
  return eventDB.getAllEventsRecord().then((result: any) => {
    return result;
  });
}

async function getDrinksName() {
  var drinkData: Drink[] = await loadDrinkIndexedDB();
  var drinkNames: DrinkNames[] = [];
  for (var key in drinkData) {
    drinkNames.push({ name: drinkData[key].name, value: 0 });
  }

  return drinkNames;
}

async function boolEvent(date: Date) {
  var result: [boolean, Date] = [false, new Date()];
  var eventList: EventList[] = await loadEventIndexedDB();
  for (var key in eventList) {
    var startDate: Date = new Date(eventList[key].start);
    if (
      date.getTime() <= startDate.getTime() &&
      date.getTime() + 24 * 60 * 60 * 1000 > startDate.getTime()
    ) {
      result = [true, startDate];
    }
  }
  return result;
}

function toISOStringWithTimezone(date: Date): string {
  const pad = function (str: string): string {
    return ("0" + str).slice(-2);
  };
  const year = date.getFullYear().toString();
  const month = pad((date.getMonth() + 1).toString());
  const day = pad(date.getDate().toString());
  const hour = pad(date.getHours().toString());
  const min = pad(date.getMinutes().toString());

  return `${year}-${month}-${day}T${hour}:${min}`;
}

const DateDrawer = ({
  open,
  toggleDrawer,
  date,
}: {
  open: boolean;
  toggleDrawer: Function;
  date: Date;
}) => {
  const [isEvenst, setIsEvent] = useState(true);
  const [startTime, setStartTime] = useState(date);
  const [endTime, setEndTime] = useState(date);
  const [drinkCounts, setDrinkCounts] = useState<DrinkNames[]>([]);
  const [eventStart, setEventStart] = useState(new Date());
  useEffect(() => {
    setStartTime(date);
    setEndTime(date);
  }, [date]);
  useEffect(() => {
    const fetchDrinkCounts = async () => {
      const drinks = await getDrinksName();
      setDrinkCounts(drinks);
    };

    fetchDrinkCounts();
  }, []);

  useEffect(() => {
    const fetchIsEvent = async () => {
      boolEvent(date).then((result) => {
        setIsEvent(result[0]);
        setEventStart(result[1]);
      });
    };
    fetchIsEvent();
  }, [date]);
  // ドリンク数と価格の変更を処理する関数
  const handleDrinkCountChange = (name: string, value: number) => {
    const updatedCounts = drinkCounts.map((count) => {
      if (count.name === name) {
        return { ...count, value: value };
      }
      return count;
    });
    setDrinkCounts(updatedCounts);
  };

  // 新しいドリンク数と価格を追加する関数

  const handleSubmit = async () => {
    var drinkData: EventDrinks[] = [];
    for (let key in drinkCounts) {
      if (drinkCounts[key].value > 0) {
        const result = await drinkDB.getDrinksRecord(drinkCounts[key].name);
        drinkData.push({
          name: drinkCounts[key].name,
          price: result.price,
          value: drinkCounts[key].value,
        });
      }
    }
    eventDB.addEventsRecord(startTime, endTime, drinkData);
    toggleDrawer(false)();
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="flex justify-center items-center h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="relative bg-white rounded-lg p-8 max-w-md w-full">
          {isEvenst ? (
            <>
              <Breakdown startDate={eventStart} />
            </>
          ) : (
            <>
              <div className="mb-4">
                <label
                  htmlFor="startTime"
                  className="block text-gray-700 font-bold mb-2"
                >
                  開始日時:
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  value={toISOStringWithTimezone(startTime)}
                  onChange={(e) => setStartTime(new Date(e.target.value))}
                  className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="endTime"
                  className="block text-gray-700 font-bold mb-2"
                >
                  終了日時:
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  min={toISOStringWithTimezone(startTime)}
                  value={toISOStringWithTimezone(endTime)}
                  onChange={(e) => setEndTime(new Date(e.target.value))}
                  className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="drinkCount"
                  className="block text-gray-700 font-bold mb-2"
                >
                  ドリンク数と価格:
                </label>
                {drinkCounts.map((drink, index) => (
                  <div key={drink.name} className="flex items-center mb-2">
                    <h1>{drink.name}</h1>
                    <span className="mx-2">x</span>
                    <input
                      type="number"
                      value={drink.value}
                      onChange={(e) =>
                        handleDrinkCountChange(
                          drink.name,
                          Number(e.target.value)
                        )
                      }
                      className="border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  送信
                </button>
              </div>
            </>
          )}
          <button
            onClick={() => toggleDrawer(false)()}
            className="absolute top-4 right-4 bg-gray-200 text-gray-700 px-2 py-1 rounded-lg"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateDrawer;
