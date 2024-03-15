import { useEffect, useRef, useState } from "react";
import InfoAlert from "../components/InfoAlert";

const deductionAmountYenKey: string = "deductionAmountYen";
// const deductionAmountPercentKey: string = "deductionAmountPercent";
const deductionAmountOptionKey: string = "deductionAmountOption";
const salesBackKey: string = "salesBack";

function getDeductionAmountYen() {
  var deductionAmount = localStorage.getItem(deductionAmountYenKey);
  if (deductionAmount) {
    return Number(deductionAmount).toLocaleString("ja-JP");
  } else {
    return "";
  }
}

/**
 * 本指名売上バック
 * @param sales 会計のリスト
 * @returns 本指名売上バックの合計
 */
export function getBookNominationBack(sales: number[]){
  const salesBack = localStorage.getItem(salesBackKey) || "0";
  const salesSum = sales.reduce((a, b) => a + b, 0);
  return Math.floor(salesSum * parseFloat(salesBack)/100);
}

export function floorNum(num: number, digit: number) {
  return (Math.floor(num * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(1);
}

export function useToggleButton() {
  const [selectedOption, setSelectedOption] = useState(
    localStorage.getItem(deductionAmountOptionKey)
      ? Number(localStorage.getItem(deductionAmountOptionKey))
      : 0
  );

  const handleOptionClick = (option: number) => {
    setSelectedOption(option);
  };

  localStorage.setItem(deductionAmountOptionKey, String(selectedOption));

  return { selectedOption, handleOptionClick };
}

export function useDeducationAmountYen() {
  const [deductionAmountYen, setDeductionAmount] = useState(
    getDeductionAmountYen()
  );
  const handleDeductionAmountYenChange = (e: { target: { value: any } }) => {
    if (isNaN(Number(e.target.value.replace(/,/g, "")))) {
      return;
    }
    const inputDeductionAmount = Number(e.target.value.replace(/,/g, ""));
    // マイナスの値が入力された場合は、0に設定する
    const newDeductionAmount =
      inputDeductionAmount < 0 ? 0 : inputDeductionAmount;
    localStorage.setItem(deductionAmountYenKey, String(newDeductionAmount));
    setDeductionAmount(newDeductionAmount.toLocaleString("ja-JP"));
  };
  return { deductionAmountYen, handleDeductionAmountYenChange };
}

export function useDeducationAmountPercent(defaultValue: string | null) {
  if (defaultValue === null) {
    defaultValue = "0"
  }
  const [deductionAmountPercent, setDeductionAmount] = useState(
    defaultValue
  );
  const handleDeductionAmountPercentChange = (e: {
    target: { value: any };
  }) => {
    if (isNaN(Number(e.target.value.replace(/,/g, "")))) {
      return;
    }
    if (
      Number(e.target.value.replace(/,/g, "")) > 100 ||
      Number(e.target.value.replace(/,/g, "")) < 0
    ) {
      return;
    }
    const inputDeductionAmount = e.target.value;
    setDeductionAmount(inputDeductionAmount);
  };
  return { deductionAmountPercent, handleDeductionAmountPercentChange };
}

export function useWage(defaultWage: string) {
  const [wage, setWage] = useState(defaultWage);
  const handleWageChange = (e: { target: { value: string } }) => {
    // Numberにキャストできない場合は何もしない
    if (isNaN(Number(e.target.value.replace(/,/g, "")))) {
      return;
    }
    // 全角の数字が入力された場合は、半角に変換する

    const inputWage = Number(e.target.value.replace(/,/g, ""));
    // マイナスの値が入力された場合は、0に設定する
    const newWage = inputWage < 0 ? 0 : inputWage;
    setWage(newWage.toLocaleString("ja-JP"));
  };
  return { wage, handleWageChange };
}

export function useCount(defaultCount: number) {
  const [count, setCount] = useState(defaultCount);
  const handleCountChange = (changeCount: number) => {
    setCount(changeCount);
  };
  return { count, handleCountChange };
}

export function useAlert() {
  const [alert, setAlert] = useState(<></>);
  const handleAlertOpen = (context: string, message: string) => {
    setAlert(<InfoAlert context={context} message={message} />);
  };
  const handleAlertClose = () => {
    setAlert(<></>);
  };
  return { alert, handleAlertOpen, handleAlertClose };
}

export function useTimePicker(hour: number = 0, minute: number = 0) {
  const [selectedHour, setSelectedHour] = useState<number>(hour);
  const [selectedMinute, setSelectedMinute] = useState<number>(minute);

  const handleHourChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHour(parseInt(event.target.value));
  };

  const handleMinuteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMinute(parseInt(event.target.value));
  };

  return { selectedHour, selectedMinute, handleHourChange, handleMinuteChange };
}

export function useToggle(defaultToggle: boolean = false) {
  const [toggle, setToggle] = useState(defaultToggle);
  const handleToggle = () => {
    setToggle(!toggle);
  };
  return { toggle, handleToggle };
}

export function usePrevious(value: number) {
  const ref = useRef<number>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
