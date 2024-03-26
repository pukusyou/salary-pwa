import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import DrinkList from "./components/DrinkList";
import "./App.css";
import React from "react";
import SettingsList from "./components/SettingList";
import HourlyRatePage from "./components/HourlyRatePage";
import CutoffDatePage from "./components/CutoffDatePage";
// import MonthlySalaryPage from "./components/MonthlySalaryPage";
import SalaryPage from "./components/SalaryPage";
import Joyride from "react-joyride";

const steps = [
  {
    target: "#setting",
    content: <h2>初めに設定を行いましょう</h2>,
    locale: { skip: "スキップ", next: "次へ", back: "戻る", last: "完了" },
    disableBeacon: true,
    spotlightClicks: true,
  },
  {
    target: "#settingList",
    content: <h2>ここで各種設定を行うことができます</h2>,
    locale: { skip: "スキップ", next: "次へ", back: "戻る", last: "完了" },
    disableBeacon: true,
    spotlightClicks: true,
  },
];

function App() {
  const [selectedItem, setSelectedItem] = React.useState("home");
  let run = false;
  if (localStorage.getItem("hourlyRate") === null) {
    run = true;
  }
  console.log(run);
  return (
    <div className="App all">
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
      <Router>
        <main className="bg-gray-100">
          <Routes>
            <Route path="/salary-pwa/" element={<Home />} />
            <Route path="/salary-pwa/setting/drink" element={<DrinkList />} />
            <Route
              path="/salary-pwa/setting/hourly"
              element={<HourlyRatePage />}
            />
            <Route path="/salary-pwa/setting" element={<SettingsList />} />
            <Route
              path="/salary-pwa/setting/cutoff"
              element={<CutoffDatePage />}
            />
            <Route path="/salary-pwa/salary" element={<SalaryPage />} />
          </Routes>
        </main>
        <Footer selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </Router>
    </div>
  );
}

export default App;
