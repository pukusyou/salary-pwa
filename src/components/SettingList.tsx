import React from "react";
import { Link } from "react-router-dom"; // react-router-dom から Link コンポーネントをインポート
import eventDB from "../scripts/eventsDB";
function resetDB() {
  eventDB.deleteDB();
  localStorage.clear();
  alert("すべての情報リセットしました");
  window.location.reload();
}

const SettingsList = () => {
  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        <div
          className="bg-white rounded-lg overflow-hidden shadow-md"
          id="settingList"
        >
          <div className="divide-y divide-gray-200">
            {/* 通知設定 */}
            <Link to="hourly" className="block">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">時給</h2>
                <p className="text-sm text-gray-500">
                  時給についての設定を変更します
                </p>
              </div>
            </Link>
            {/* プライバシー設定 */}
            <Link to="drink" className="block">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">ドリンク設定</h2>
                <p className="text-sm text-gray-500">
                  ドリンクの設定を変更します
                </p>
              </div>
            </Link>
            {/* 締め日設定 */}
            <Link to="cutoff" className="block">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">締め日</h2>
                <p className="text-sm text-gray-500">
                  締め日の設定を変更します
                </p>
              </div>
            </Link>
            <div
              className="p-4"
              style={{ cursor: "pointer" }}
              onClick={resetDB}
            >
              <h2 className="text-lg font-semibold mb-2">
                <span style={{ color: "red" }}>リセット</span>
              </h2>
              <p className="text-sm text-gray-500">
                <span style={{ color: "red" }}>
                  登録情報のリセットを行います
                </span>
              </p>
            </div>
            {/* 他の設定項目を追加 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsList;
