import { useEffect, useState } from "react";
import eventDB from "../scripts/eventsDB";

interface EventDrinks {
  name: string;
  price: number;
  value: number;
}

function loadEvent(date: Date) {
  return eventDB.getEventsRecord(date).then((result: any) => {
    return result;
  });
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

const EditDateDrawer = ({
  date,
  setOpen,
  setNewStartDate,
}: {
  date: Date;
  setOpen: Function;
  setNewStartDate: Function;
}) => {
  const [startTime, setStartTime] = useState(new Date(date));
  const [endTime, setEndTime] = useState(new Date(date));
  const [drinkCounts, setDrinkCounts] = useState<EventDrinks[]>([]);
  const [addDrinkList, setAddDrinkList] = useState<EventDrinks[]>([]);
  const preDate: Date = new Date(date);
  useEffect(() => {
    const fetchEventData = async () => {
      const eventData = await loadEvent(date);
      setStartTime(eventData.start);
      setEndTime(eventData.end);
      const drinkData: EventDrinks[] = [];
      for (var key in eventData.drinks) {
        var drinkName = eventData.drinks[key].name;
        var drinkValue = eventData.drinks[key].value;
        var drinkPrice = eventData.drinks[key].price;
        var drink = { name: drinkName, price: drinkPrice, value: drinkValue };
        drinkData.push(drink);
      }
      setDrinkCounts(drinkData);
    };

    fetchEventData();
  }, [date]);
  const handleDrinkCountChange = (name: string, value: number) => {
    const updatedCounts = drinkCounts.map((count) => {
      if (count.name === name) {
        return { ...count, value: value };
      }
      return count;
    });
    setDrinkCounts(updatedCounts);
  };

  const handleDrinkPriceChange = (name: string, price: number) => {
    const updatedCounts = drinkCounts.map((count) => {
      if (count.name === name) {
        return { ...count, price: price };
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
        drinkData.push({
          name: drinkCounts[key].name,
          price: drinkCounts[key].price,
          value: drinkCounts[key].value,
        });
      }
    }
    if (startTime === preDate) {
      eventDB.putEventsRecord(startTime, endTime, drinkData);
    } else {
      eventDB.deleteEventsRecord(preDate);
      eventDB.addEventsRecord(startTime, endTime, drinkData);
    }
    setNewStartDate(startTime);
    setOpen(false);
  };

  const handleAddDrink = () => {
    setAddDrinkList([...addDrinkList, { name: "", price: 0, value: 0 }]);
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof EventDrinks
  ) => {
    const newDrinks: EventDrinks[] = [...addDrinkList];
    if (field === "price" || field === "value") {
      newDrinks[index] = {
        ...newDrinks[index],
        [field]: Number(e.target.value),
      };
    } else {
      newDrinks[index] = { ...newDrinks[index], [field]: e.target.value };
    }
    setAddDrinkList(newDrinks);
  };

  const handleRemoveDrink = (name: string) => {
    const newAddDrinkList = addDrinkList.filter((drink) => drink.name !== name);
    setAddDrinkList(newAddDrinkList);
  };

  return (
    <div className={"fixed z-10 inset-0 overflow-y-auto block"}>
      <div className="flex justify-center items-center h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="relative bg-white rounded-lg p-8 max-w-md w-full">
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
            <div className="mb-4 w-full">
              <label
                htmlFor="drinkCount"
                className="block text-gray-700 font-bold border-b-2 pb-1"
              >
                ドリンク数と価格:
              </label>
              {drinkCounts.map((drink, index) => (
                <div key={index} className="mb-2 w-full border-b-2 pb-3">
                  <h1 className="text-2xl pb-1">{drink.name}</h1>
                  <span className="mx-2">￥</span>
                  <input
                    type="number"
                    value={drink.price}
                    onChange={(e) =>
                      handleDrinkPriceChange(drink.name, Number(e.target.value))
                    }
                    className="border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-1/3"
                  />
                  <span className="mx-2">x</span>
                  <input
                    type="number"
                    value={drink.value}
                    onChange={(e) =>
                      handleDrinkCountChange(drink.name, Number(e.target.value))
                    }
                    className="border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-1/5"
                  />
                </div>
              ))}
              {addDrinkList.map((drink, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 mb-4 bg-white rounded-lg shadow-md p-4 "
                >
                  <div className="flex flex-col flex-1 w-1/3">
                    <label
                      htmlFor={`drinkName-${index}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      名称
                    </label>
                    <input
                      type="text"
                      id={`drinkName-${index}`}
                      placeholder="名称"
                      value={drink.name}
                      className="border rounded px-3 py-2 mt-1"
                      onChange={(e) => handleChange(index, e, "name")}
                    />
                  </div>
                  <div className="flex flex-col flex-1 w-1/3">
                    <label
                      htmlFor={`drinkPrice-${index}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      値段
                    </label>
                    <input
                      type="number"
                      id={`drinkPrice-${index}`}
                      placeholder="値段"
                      value={drink.price}
                      className="border rounded px-3 py-2 mt-1"
                      onChange={(e) => handleChange(index, e, "price")}
                    />
                  </div>
                  <div className="flex flex-col flex-1 w-1/4">
                    <label
                      htmlFor={`drinkValue-${index}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      個数
                    </label>
                    <input
                      type="number"
                      id={`drinkValue-${index}`}
                      placeholder="個数"
                      value={drink.value}
                      className="border rounded px-3 py-2 mt-1"
                      onChange={(e) => handleChange(index, e, "value")}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveDrink(drink.name)}
                    className="border rounded-full px-2 py-2 bg-red-500 text-white flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddDrink}
                className="border rounded px-2 py-1 bg-green-500 text-white mt-2 block mx-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
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
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded-lg"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDateDrawer;
