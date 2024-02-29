import React, { useEffect, useState } from "react";
import drinkDB from "../scripts/drinksDB";

interface Drink {
  name: string;
  price: number;
}

function saveIndexedDB(drinks: Drink[]) {
  const drinkData = drinkDB;
  for (var key in drinks) {
    drinkData.putDrinksRecord(drinks[key].name, drinks[key].price);
  }
}

function deleteIndexedDB(name: string) {
  const drinkData = drinkDB;
  drinkData.deleteDrinksRecord(name);
}

const DrinkList: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  useEffect(() => {
    var drinkData: Drink[] = [];
    drinkDB.getAllDrinksRecord().then((result: any) => {
      drinkData = result;
      setDrinks(drinkData);
    });
  }, []);

  const handleAddDrink = () => {
    setDrinks([...drinks, { name: "", price: 0 }]);
  };
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Drink
  ) => {
    const newDrinks: Drink[] = [...drinks];
    if (field === "price") {
      newDrinks[index] = {
        ...newDrinks[index],
        [field]: Number(e.target.value),
      };
    } else {
      newDrinks[index] = { ...newDrinks[index], [field]: e.target.value };
    }
    setDrinks(newDrinks);
  };

  const handleRemoveDrink = (index: number) => {
    const newDrinks = [...drinks];
    var removeData: Drink = newDrinks.splice(index, 1)[0];
    setDrinks(newDrinks);
    deleteIndexedDB(removeData.name);
  };

  const handleComplete = () => {
    saveIndexedDB(drinks);
  };

  return (
    <div className="mx-auto mt-8 max-w-screen-sm">
      {drinks.map((drink, index) => (
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
              onChange={(e) => handleChange(index, e, "name")}
              className="border rounded px-3 py-2 mt-1"
            />
          </div>
          <div className="flex flex-col flex-1 w-1/3">
            <label
              htmlFor={`drinkPrice-${index}`}
              className="text-sm font-medium text-gray-700"
            >
              バック(円)
            </label>
            <input
              type="number"
              id={`drinkPrice-${index}`}
              placeholder="バック"
              value={drink.price}
              onChange={(e) => handleChange(index, e, "price")}
              className="border rounded px-3 py-2 mt-1"
            />
          </div>
          <button
            onClick={() => handleRemoveDrink(index)}
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
      <button
        onClick={handleComplete}
        className="border rounded px-2 py-1 bg-blue-500 text-white"
      >
        完了
      </button>
    </div>
  );
};

export default DrinkList;
