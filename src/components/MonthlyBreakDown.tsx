import { floorWage } from "../scripts/customhooks";

const hourlyRateKey: string = "hourlyRate";
const salesBackOptionKey: string = "bookNominationBack";
const salesBackKey: string = "salesBack";

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

function getDrinkList(eventData: EventList[]) {
  var result: DrinkNames[] = [];
  var drinkMap: { [name: string]: DrinkNames } = {};

  for (var i = 0; i < eventData.length; i++) {
    var drinks = eventData[i].drinks;
    for (var j = 0; j < drinks.length; j++) {
      var drink = drinks[j];
      if (drink.name in drinkMap) {
        drinkMap[drink.name].value += drink.value;
      } else {
        drinkMap[drink.name] = { ...drink };
      }
    }
  }

  for (var name in drinkMap) {
    result.push(drinkMap[name]);
  }

  return result;
}

export const MonthlyBreakDown = ({
  open,
  setOpen,
  salary,
  workTime,
  eventData,
  deducation,
  bookNomination,
  hallNomination,
  totalSales,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  salary: number;
  workTime: number;
  eventData: EventList[];
  deducation: number;
  bookNomination: number;
  hallNomination: number;
  totalSales: number;
}) => {
  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
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
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center flex-col bg-white rounded-lg shadow-lg p-8 w-full">
              <div className="text-2xl font-bold mb-4">
                ￥ {floorWage(salary).toLocaleString("ja-JP")}
              </div>
              <div className="border-b border-gray-300 w-full"></div>
              <div className="mt-4 w-full">
                <h2 className="text-lg font-semibold mb-2">内訳:</h2>
                <ul>
                  <li className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span>時給</span>
                    <span className="text-right">
                      {workTime.toFixed(1)}
                      時間 x ￥
                      {Number(
                        localStorage.getItem(hourlyRateKey)
                      ).toLocaleString("ja-JP")}
                    </span>
                  </li>
                  {bookNomination > 0 ? (
                    <li className="flex justify-between items-center py-2 border-b border-gray-300">
                      <span>本指名</span>
                      <span className="text-right">
                        {bookNomination} x ￥
                        {localStorage.getItem("bookNomination")}
                      </span>
                    </li>
                  ) : null}
                  {localStorage.getItem(salesBackOptionKey) === "true" &&
                  bookNomination > 0 ? (
                    <li className="flex justify-between items-center py-2 border-b border-gray-300">
                      <span>本指名会計バック</span>
                      <span className="text-right">
                        {localStorage.getItem(salesBackKey)} % ￥{" "}
                        {totalSales.toLocaleString("ja-JP")}
                      </span>
                    </li>
                  ) : null}
                  {hallNomination > 0 ? (
                    <li className="flex justify-between items-center py-2 border-b border-gray-300">
                      <span>場内指名</span>
                      <span className="text-right">
                        {hallNomination} x ￥
                        {localStorage.getItem("hallNomination")}
                      </span>
                    </li>
                  ) : null}
                  {getDrinkList(eventData).map((drink, index) => (
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
                      -{" "}
                      {deducation.toLocaleString("JP", {
                        style: "currency",
                        currency: "JPY",
                      })}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
