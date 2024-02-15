import React from "react";
import { Link } from "react-router-dom"; // react-router-dom から Link コンポーネントをインポート

const SettingsList = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="divide-y divide-gray-200">
            {/* 通知設定 */}
            <Link to={"hourly"} className="block">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">時給</h2>
                <p className="text-sm text-gray-500">
                  時給についての設定を変更します
                </p>
              </div>
            </Link>
            {/* プライバシー設定 */}
            <Link to={"drink"} className="block">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">ドリンク設定</h2>
                <p className="text-sm text-gray-500">
                  ドリンクの設定を変更します
                </p>
              </div>
            </Link>
            {/* Wi-Fi設定 */}
            <Link to="/wifi" className="block">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">Wi-Fi設定</h2>
                <p className="text-sm text-gray-500">Wi-Fiの設定を変更します</p>
              </div>
            </Link>
            {/* 他の設定項目を追加 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsList;
