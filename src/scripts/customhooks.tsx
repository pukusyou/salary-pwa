import { useState } from "react";
import InfoAlert from "../components/InfoAlert";

const deductionAmountYenKey: string = "deductionAmountYen";
const deductionAmountPercentKey: string = "deductionAmountPercent";
const deductionAmountOptionKey: string = "deductionAmountOption";

function getDeductionAmountYen() {
  var deductionAmount = localStorage.getItem(deductionAmountYenKey);
  if (deductionAmount) {
    return Number(deductionAmount).toLocaleString("ja-JP");
  } else {
    return "";
  }
}

function getDeductionAmountPercent() {
  var deductionAmount = localStorage.getItem(deductionAmountPercentKey);
  if (deductionAmount) {
    return Number(deductionAmount).toLocaleString("ja-JP");
  } else {
    return 0;
  }
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
    const inputDeductionAmount = Number(e.target.value.replace(/,/g, ""));
    // マイナスの値が入力された場合は、0に設定する
    const newDeductionAmount =
      inputDeductionAmount < 0 ? 0 : inputDeductionAmount;
    localStorage.setItem(deductionAmountYenKey, String(newDeductionAmount));
    setDeductionAmount(newDeductionAmount.toLocaleString("ja-JP"));
  };
  return { deductionAmountYen, handleDeductionAmountYenChange };
}

export function useDeducationAmountPercent() {
  const [deductionAmountPercent, setDeductionAmount] = useState(
    getDeductionAmountPercent()
  );
  const handleDeductionAmountPercentChange = (e: {
    target: { value: any };
  }) => {
    const inputDeductionAmount = e.target.value;
    setDeductionAmount(inputDeductionAmount);
  };
  return { deductionAmountPercent, handleDeductionAmountPercentChange };
}

export function useWage(defaultWage: string) {
  const [wage, setWage] = useState(defaultWage);
  const handleWageChange = (e: { target: { value: any } }) => {
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
