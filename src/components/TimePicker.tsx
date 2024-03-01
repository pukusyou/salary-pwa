import React from "react";

function getDate(date: Date, hour: number, minute: number) {
  const newDate = new Date(date);
  if (hour >= 24) {
    newDate.setDate(newDate.getDate() + 1);
    hour -= 24;
  }
  newDate.setHours(hour);
  newDate.setMinutes(minute);

  return newDate;
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

const TimePicker = ({
  date,
  startSelectedHour,
  startSelectedMinute,
  startHandleHourChange,
  startHandleMinuteChange,
  endSelectedHour,
  endSelectedMinute,
  endHandleHourChange,
  endHandleMinuteChange,
}: {
  date: Date;
  startSelectedHour: number;
  startSelectedMinute: number;
  startHandleHourChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  startHandleMinuteChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  endSelectedHour: number;
  endSelectedMinute: number;
  endHandleHourChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  endHandleMinuteChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  // 48時間以内の時間の配列を生成
  const generateHours = (): number[] => {
    const hours: number[] = [];
    for (let i = 0; i < 48; i++) {
      hours.push(i);
    }
    return hours;
  };

  const generateMinutes = (): number[] => {
    const minutes: number[] = [];
    for (let i = 0; i < 60; i++) {
      minutes.push(i);
    }
    return minutes;
  };

  return (
    <div className="flex flex-col mt-4 mb-4">
      <label htmlFor="startTime" className="block text-gray-700 font-bold mb-2">
        開始日時:
      </label>
      <input
        type="datetime-local"
        id="startTime"
        value={toISOStringWithTimezone(
          getDate(date, startSelectedHour, startSelectedMinute)
        )}
        className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
        disabled
      />
      <div className="flex">
        <select
          className="p-2 border border-gray-300 rounded-lg mr-1 w-1/2"
          onChange={startHandleHourChange}
          value={startSelectedHour ?? ""}
        >
          {generateHours().map((hour) => (
            <option key={hour} value={hour}>
              {hour.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <span className="text-lg mx-1">:</span>
        <select
          className="p-2 border border-gray-300 rounded-lg ml-1 w-1/2"
          onChange={startHandleMinuteChange}
          value={startSelectedMinute ?? ""}
        >
          {generateMinutes().map((minute) => (
            <option key={minute} value={minute}>
              {minute.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
      <label
        htmlFor="startTime"
        className="block text-gray-700 font-bold mb-2 mt-4"
      >
        終了日時:
      </label>
      <input
        type="datetime-local"
        id="startTime"
        value={toISOStringWithTimezone(
          getDate(date, endSelectedHour, endSelectedMinute)
        )}
        className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
        disabled
      />
      <div className="flex">
        <select
          className="p-2 border border-gray-300 rounded-lg mr-1 w-1/2"
          onChange={endHandleHourChange}
          value={endSelectedHour ?? ""}
        >
          {generateHours().map((hour) => (
            <option key={hour} value={hour}>
              {hour.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <span className="text-lg mx-1">:</span>
        <select
          className="p-2 border border-gray-300 rounded-lg ml-1 w-1/2"
          onChange={endHandleMinuteChange}
          value={endSelectedMinute ?? ""}
        >
          {generateMinutes().map((minute) => (
            <option key={minute} value={minute}>
              {minute.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimePicker;
