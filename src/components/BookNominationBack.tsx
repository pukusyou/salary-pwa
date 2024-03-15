import React from "react";

interface Props {
  values: string[];
  onUpdate: (values: string[]) => void;
}

const BookNominationBack: React.FC<Props> = ({ values, onUpdate }) => {
  const handleChange = (index: number, value: string) => {
    // Numberにキャストできない場合は何もしない
    if (isNaN(Number(value.replace(/,/g, "")))) {
      return;
    }
    // 全角の数字が入力された場合は、半角に変換する

    const inputWage = Number(value.replace(/,/g, ""));
    // マイナスの値が入力された場合は、0に設定する
    const newValue = inputWage < 0 ? 0 : inputWage;
    if (!isNaN(newValue)) {
      const newValues = [...values];
      newValues[index] = newValue.toLocaleString("ja-JP");
      onUpdate(newValues);
    }
  };
  return (
    <div className="">
      {values.length > 0 ? (
        <label
          htmlFor="drinkCount"
          className="block text-gray-700 font-bold mb-2"
        >
          本指名会計:
        </label>
      ) : null}
      {Array.from({ length: Math.min(values.length, 5) }).map((_, index) => (
        <div key={index} className="flex h-12 my-2 p-2 items-center">
          <span className="mr-2">￥</span>
          <input
            key={index}
            type="text"
            className="block w-full border border-gray-300 rounded"
            placeholder={`Amount ${index + 1}`}
            value={values[index]}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default BookNominationBack;
