import React from "react";
import { Link } from "react-router-dom"; // react-router-dom から Link コンポーネントをインポート
import eventDB from "../scripts/eventsDB";
import Joyride, { Step } from "react-joyride";

function resetDB() {
  // ユーザに確認を求める
  if (window.confirm("本当に削除しますか？")) {
    eventDB.deleteDB();
    localStorage.clear();
    alert("すべての情報リセットしました");
    window.location.reload();
  }
}
const steps: Step[] = [
  {
    target: "#settingList",
    content: "ここでは各種設定ができます",
    locale: { skip: "スキップ", next: "次へ", back: "戻る", last: "完了" },
    disableBeacon: true,
    spotlightClicks: true,
  },
  {
    target: "#hourly",
    content: "ここでは時給や指名のバック、引かれものを設定できます",
    locale: { skip: "スキップ", next: "次へ", back: "戻る", last: "完了" },
    disableBeacon: true,
    spotlightClicks: true,
  },
  {
    target: "#drinks",
    content: "ここではドリンクのバックを設定できます",
    locale: { skip: "スキップ", next: "次へ", back: "戻る", last: "完了" },
    disableBeacon: true,
    spotlightClicks: true,
  },
  {
    target: "#cutoff",
    content: "ここでは締め日を設定できます(2日設定可能)",
    locale: { skip: "スキップ", next: "次へ", back: "戻る", last: "完了" },
    disableBeacon: true,
    spotlightClicks: true,
  },
];

const SettingsList = () => {
  let run = false;
  if (localStorage.getItem("hourlyRate") === null) {
    run = true;
  }
  return (
    <>
      <Joyride
        continuous
        hideCloseButton
        run={run} // ツアーを始める時にtrueにする
        scrollToFirstStep
        showProgress // 1/2などの数が表示される
        showSkipButton
        steps={steps}
        spotlightClicks
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />

      <div className="p-4">
        <div className="max-w-md mx-auto">
          <div
            className="bg-white rounded-lg overflow-hidden shadow-md"
            id="settingList"
          >
            <div className="divide-y divide-gray-200">
              {/* 通知設定 */}
              <Link to="hourly" className="block" id="hourly">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">時給</h2>
                  <p className="text-sm text-gray-500">
                    時給についての設定を変更します
                  </p>
                </div>
              </Link>
              {/* プライバシー設定 */}
              <Link to="drink" className="block" id="drinks">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">ドリンク設定</h2>
                  <p className="text-sm text-gray-500">
                    ドリンクの設定を変更します
                  </p>
                </div>
              </Link>
              {/* 締め日設定 */}
              <Link to="cutoff" className="block" id="cutoff">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">締め日</h2>
                  <p className="text-sm text-gray-500">
                    締め日の設定を変更します
                  </p>
                </div>
              </Link>
              {/* プライバシーポリシ */}
              <Link to="../privacy" className="block" id="privacy">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">
                    プライバシポリシー
                  </h2>
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
    </>
  );
};

export default SettingsList;
