import React, { useEffect, useState } from "react";
import eventDB from "../scripts/eventsDB";
import drinkDB from "../scripts/drinksDB";
import InfoAlert from "./InfoAlert";
import BookNominationBack from "./BookNominationBack";

const bookNominationBackKey: string = "bookNominationBack";

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

function loadDrinkList() {
  return drinkDB.getAllDrinksRecord().then((result: any) => {
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

function createOptions(options: string[], drinkCounts: EventDrinks[]) {
  const drinkNames = drinkCounts.map((drink) => drink.name);
  const uniqueDrinkNames = Array.from(drinkNames);
  // options - uniqueDrinkNames
  options = options.filter((option) => !uniqueDrinkNames.includes(option));
  return options;
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
  const [alert, setAlert] = useState(<></>);
  const [options, setOptions] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(new Date(date));
  const [endTime, setEndTime] = useState(new Date(date));
  const [drinkCounts, setDrinkCounts] = useState<EventDrinks[]>([]);
  const [addDrinkList, setAddDrinkList] = useState<EventDrinks[]>([]);
  const [bookNominationCount, setBookNomination] = useState(0);
  const [hallNominationCount, setHallNomination] = useState(0);
  const [values, setValues] = useState<string[]>(
    Array(bookNominationCount).fill("0")
  );
  const preDate: Date = new Date(date);
  useEffect(() => {
    const fetchEventData = async () => {
      const eventData = await loadEvent(date);
      setStartTime(eventData.start);
      setEndTime(eventData.end);
      setBookNomination(eventData.bookNomination);
      setHallNomination(eventData.hallNomination);
      setValues(eventData.sales.map((value: number) => value.toLocaleString()));
      const drinkData: EventDrinks[] = [];
      for (var key in eventData.drinks) {
        var drinkName = eventData.drinks[key].name;
        var drinkValue = eventData.drinks[key].value;
        var drinkPrice = eventData.drinks[key].price;
        var drink = { name: drinkName, price: drinkPrice, value: drinkValue };
        drinkData.push(drink);
      }
      const fetchDrinkList = async () => {
        const drinkList = await loadDrinkList();
        const drinkNames = drinkList.map((drink: any) => drink.name);
        setOptions(drinkNames);
      };
      setDrinkCounts(drinkData);
      fetchDrinkList();
    };

    fetchEventData();
  }, [date]);

  const handleBookNominationCountChange = (value: number) => {
    let prev = bookNominationCount;
    setBookNomination(value);
    if (prev < value) {
      setValues(values.concat(Array(value - prev).fill("0")));
    } else {
      setValues(values.slice(0, value));
    }
  };

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
    if (startTime > endTime) {
      setAlert(
        <InfoAlert context="エラー" message="終了日時が開始日時より前です" />
      );
      return;
    }
    if (startTime === endTime) {
      setAlert(
        <InfoAlert context="エラー" message="開始日時と終了日時が同じです" />
      );
      return;
    }
    for (let key in drinkCounts) {
      if (drinkCounts[key].value > 0) {
        drinkData.push({
          name: drinkCounts[key].name,
          price: drinkCounts[key].price,
          value: drinkCounts[key].value,
        });
      }
    }
    for (let key in addDrinkList) {
      if (addDrinkList[key].value > 0) {
        drinkData.push(addDrinkList[key]);
      }
    }
    var newValues = values.map((value) => Number(value.replace(/,/g, "")));
    if (startTime === preDate) {
      eventDB.putEventsRecord(
        startTime,
        endTime,
        drinkData,
        bookNominationCount,
        hallNominationCount,
        newValues
      );
    } else {
      eventDB.deleteEventsRecord(preDate);
      eventDB.addEventsRecord(
        startTime,
        endTime,
        drinkData,
        bookNominationCount,
        hallNominationCount,
        newValues
      );
    }
    setNewStartDate(startTime);
    setOpen(false);
  };

  const handleAddDrink = () => {
    setAddDrinkList([...addDrinkList, { name: "", price: 0, value: 0 }]);
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>,
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

  const handleOptionChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = e.target.value;
    const drinkData = await drinkDB.getDrinksRecord(selectedOption);
    const isOptionExist = addDrinkList.some(
      (drink) => drink.name === selectedOption
    );
    setAddDrinkList([
      ...addDrinkList.slice(0, addDrinkList.length - 1),
      { name: selectedOption, price: drinkData.price, value: 0 },
    ]);
    if (!isOptionExist) {
      setAlert(<></>);
    } else {
      setAlert(
        <InfoAlert context="重複" message="同じドリンクが既に存在します" />
      );
    }
  };

  return (
    <div className={"fixed z-10 inset-0 overflow-y-auto block"}>
      <div className="flex justify-center items-center h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="relative bg-white rounded-lg p-8 max-w-md w-full">
          <>
            {alert}
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
                  {drink.name !== "その他" ? (
                    <>
                      <span className="mx-2">x</span>
                      <select
                        value={drink.value}
                        onChange={(e) =>
                          handleDrinkCountChange(
                            drink.name,
                            Number(e.target.value)
                          )
                        }
                        className="border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-1/5"
                      >
                        {Array.from({ length: 100 }, (_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : null}
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
                    <select
                      id="options"
                      name="options"
                      className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={drink.name}
                      onChange={handleOptionChange}
                    >
                      <option value="">選択</option>
                      {createOptions(options, drinkCounts).map(
                        (option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col flex-1 w-1/4">
                    <label
                      htmlFor={`drinkValue-${index}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      個数
                    </label>
                    <select
                      id={`drinkValue-${index}`}
                      value={drink.value}
                      className="border rounded px-3 py-2 mt-1"
                      onChange={(e) => handleChange(index, e, "value")}
                    >
                      {Array.from({ length: 100 }, (_, i) => i).map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
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
            <div className="mb-4">
              <label
                htmlFor="drinkCount"
                className="block text-gray-700 font-bold mb-2"
              >
                指名:
              </label>
              <div className="flex items-center justify-between mb-2">
                <h1 className="flex-grow">本指名</h1>
                <span className="mx-2">x</span>
                <select
                  value={bookNominationCount}
                  className="border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-1/3"
                  onChange={(e) =>
                    handleBookNominationCountChange(Number(e.target.value))
                  }
                >
                  {Array.from({ length: 100 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              {localStorage.getItem(bookNominationBackKey) === "true" ? (
                <BookNominationBack values={values} onUpdate={setValues} />
              ) : null}
              <div className="flex items-center justify-between mb-2">
                <h1 className="flex-grow">場内指名</h1>
                <span className="mx-2">x</span>
                <select
                  value={hallNominationCount}
                  className="border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-1/3"
                  onChange={(e) => setHallNomination(Number(e.target.value))}
                >
                  {Array.from({ length: 100 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
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
