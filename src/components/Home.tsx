import "../App.css";
import Calendar from "./Calendar";
import Joyride from "react-joyride";

import { Step } from "react-joyride";

export const steps: Step[] = [
  {
    target: "#setting",
    content: "初めに設定を行いましょう",
    locale: { skip: "スキップ", next: "次へ", back: "戻る", last: "完了" },
    disableBeacon: true,
    spotlightClicks: true,
  },
];

export default function Home() {
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
      <Calendar />
    </>
  );
}
