import React, { useState } from 'react';

const WorkRecordForm = () => {
  const [workTime, setWorkTime] = useState('');
  const [drinkCount, setDrinkCount] = useState('');
  const [nominationCount, setNominationCount] = useState('');

  const handleWorkTimeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setWorkTime(event.target.value);
  };

  const handleDrinkCountChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setDrinkCount(event.target.value);
  };

  const handleNominationCountChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNominationCount(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // ここで入力されたデータを保存する処理を実行する
    console.log('Work time:', workTime);
    console.log('Drink count:', drinkCount);
    console.log('Nomination count:', nominationCount);
    // 保存後に入力をリセットする
    setWorkTime('');
    setDrinkCount('');
    setNominationCount('');
  };

  return (
        <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
            <label htmlFor="workTime" className="block text-sm font-medium text-gray-700">働いた時間（例：1時間30分）</label>
            <input
                id="workTime"
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="1時間30分"
                value={workTime}
                onChange={handleWorkTimeChange}
            />
            </div>
            <div>
            <label htmlFor="drinkCount" className="block text-sm font-medium text-gray-700">ドリンク数</label>
            <input
                id="drinkCount"
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="ドリンク数"
                value={drinkCount}
                onChange={handleDrinkCountChange}
            />
            </div>
            <div>
            <label htmlFor="nominationCount" className="block text-sm font-medium text-gray-700">指名数</label>
            <input
                id="nominationCount"
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="指名数"
                value={nominationCount}
                onChange={handleNominationCountChange}
            />
            </div>
        </div>
        <div className="mt-4">
            <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
            記録する
            </button>
        </div>
        </div>

  );
};

export default WorkRecordForm;
