import { useEffect, useState } from 'react';

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

const DateDrawer = ({ open, toggleDrawer, date, addEvents }: { open: boolean, toggleDrawer: Function, date: Date, addEvents: Function }) => {
  const [startTime, setStartTime] = useState(date);
  const [endTime, setEndTime] = useState(date);
  const [drinkCounts, setDrinkCounts] = useState([{ id: 0, value: '' }]);
  const [nominationCount, setNominationCount] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    setStartTime(date);
    setEndTime(date);
  }, [date]);

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
    const elapsed = new Date(endTime).getTime() - new Date(startTime).getTime();
    const elapsedHours = (elapsed / (1000 * 60 * 60)).toFixed(1);
    var title = elapsedHours + "h " + name;
    addEvents(new Date(startTime), new Date(endTime), title, "Work", "green");
    toggleDrawer(false);
  };

  return (
    <div className={`fixed z-10 inset-0 overflow-y-auto ${open ? 'block' : 'hidden'}`}>
      <div className="flex justify-center items-center h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="relative bg-white rounded-lg p-8 max-w-md w-full">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">名称:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="startTime" className="block text-gray-700 font-bold mb-2">開始日時:</label>
            <input type="datetime-local" id="startTime" value={toISOStringWithTimezone(startTime)} onChange={(e) => setStartTime(new Date(e.target.value))} className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-gray-700 font-bold mb-2">終了日時:</label>
            <input type="datetime-local" id="endTime" min={toISOStringWithTimezone(startTime)} value={toISOStringWithTimezone(endTime)} onChange={(e) => setEndTime(new Date(e.target.value))} className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="drinkCount" className="block text-gray-700 font-bold mb-2">ドリンク数:</label>
            {drinkCounts.map((count, index) => (
              <div key={count.id} className="flex items-center mb-2">
                <input type="number" value={count.value} onChange={(e) => handleDrinkCountChange(count.id, e.target.value)} className="border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                {index > 0 && (
                  <button type="button" onClick={() => removeDrinkCount(count.id)} className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">削除</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addDrinkCount} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">追加</button>
          </div>
          <div className="mb-4">
            <label htmlFor="nominationCount" className="block text-gray-700 font-bold mb-2">指名数:</label>
            <select id="nominationCount" value={nominationCount} onChange={(e) => setNominationCount(e.target.value)} className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">選択してください</option>
              <option value="0">0回</option>
              <option value="1">1回</option>
              <option value="2">2回以上</option>
            </select>
          </div>
          <div className="flex justify-center">
            <button type="button" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">送信</button>
          </div>
          <button onClick={() => toggleDrawer(false)()} className="absolute top-4 right-4 bg-gray-200 text-gray-700 px-2 py-1 rounded-lg">閉じる</button>
        </div>
      </div>
    </div>
  );
}

export default DateDrawer;
