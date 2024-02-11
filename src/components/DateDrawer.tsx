import Drawer from '@mui/material/Drawer';

import { useEffect, useState } from 'react';

interface DateDrawerProps {
  open: boolean;
  toggleDrawer: (open: boolean) => () => void;
  date: Date;
  addEvents: (start: Date, end: Date, title: string, description: string, bgcolor: string) => void;
}

function toISOStringWithTimezone(date: Date): string {
  const pad = function (str: string): string {
      return ('0' + str).slice(-2);
  }
  const year = (date.getFullYear()).toString();
  const month = pad((date.getMonth() + 1).toString());
  const day = pad(date.getDate().toString());
  const hour = pad(date.getHours().toString());
  const min = pad(date.getMinutes().toString());

  return `${year}-${month}-${day}T${hour}:${min}`;
}

function DateDrawer({ open, toggleDrawer, date, addEvents }: DateDrawerProps) {
  // const [open, setOpen] = useState(false);
  console.log(date);
  const [startTime, setStartTime] = useState(date);
  const [endTime, setEndTime] = useState(date);
  const [drinkCounts, setDrinkCounts] = useState([{ id: 0, value: '' }]);
  const [nominationCount, setNominationCount] = useState('');
  const [name, setName] = useState('');
  useEffect(() => {
    setStartTime(date);
    setEndTime(date);
  }
  , [date]);
  const handleDrinkCountChange = (id: number, value: string) => {
    const updatedCounts = drinkCounts.map(count =>
      count.id === id ? { ...count, value } : count
    );
    setDrinkCounts(updatedCounts);
  };
  const addDrinkCount = () => {
    const newId = drinkCounts.length;
    setDrinkCounts([...drinkCounts, { id: newId, value: '' }]);
  };

  const removeDrinkCount = (id: number) => {
    const filteredCounts = drinkCounts.filter(count => count.id !== id);
    setDrinkCounts(filteredCounts);
  };

  const handleSubmit = () => {
    // ここでデータを送信するか、必要に応じて処理を行います
    // endTimeからstartTimeを引いて、経過時間を求める
    const elapsed = endTime.getTime() - startTime.getTime();
    // 少数表示で時間表示に変換
    const elapsedHours = (elapsed / (1000 * 60 * 60)).toFixed(1);
    var title: string = elapsedHours + "h " + name;
    addEvents(startTime, endTime, title, "Work", "green");
    toggleDrawer(false)();
    // console.log(open);
    // フォーム送信後の処理を追加する場合はここに追加します
  };

  return (
    <>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor='bottom'>
        <div className="p-4">
          <h1 className="text-xl font-bold mb-2">{date.toLocaleDateString("ja-JP", {year: "numeric", month: "2-digit", day: "2-digit"})}</h1>
          <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">名称:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-gray-700 font-bold mb-2">開始日時:</label>
                <input type="datetime-local" id="startTime" value={toISOStringWithTimezone(startTime)} onChange={(e) => setStartTime(new Date(e.target.value))} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="mb-4">
                <label htmlFor="endTime" className="block text-gray-700 font-bold mb-2">終了日時:</label>
                <input type="datetime-local" id="endTime" min={toISOStringWithTimezone(startTime)} value={toISOStringWithTimezone(endTime)} onChange={(e) => setEndTime(new Date(e.target.value))} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="mb-4">
                <label htmlFor="drinkCount" className="block text-gray-700 font-bold mb-2">ドリンク数:</label>
                {drinkCounts.map((count, index) => (
                  <div key={count.id} className="flex items-center mb-2">
                    <input type="number" value={count.value} onChange={(e) => handleDrinkCountChange(count.id, e.target.value)} className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    {index > 0 && (
                      <button type="button" onClick={() => removeDrinkCount(count.id)} className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">削除</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addDrinkCount} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">追加</button>
              </div>
              <div className="mb-4">
                <label htmlFor="nominationCount" className="block text-gray-700 font-bold mb-2">指名数:</label>
                <select id="nominationCount" value={nominationCount} onChange={(e) => setNominationCount(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option value="">選択してください</option>
                  <option value="0">0回</option>
                  <option value="1">1回</option>
                  <option value="2">2回以上</option>
                </select>
              </div>
              <div className="flex justify-center">
                <button type="button" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">送信</button>
              </div>
            </div>
          </div>
          <button onClick={() => toggleDrawer(false)()} className="absolute top-4 right-4 bg-gray-200 text-gray-700 px-2 py-1 rounded-lg">閉じる</button>
        </div>
      </Drawer>
    </>
  );
}


export default DateDrawer;

