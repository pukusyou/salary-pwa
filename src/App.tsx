import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
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

function App() {
  const [selectedItem, setSelectedItem] = React.useState("home");
  return (
    <div className="App all">
      <Router>
        <main className="bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setting/drink" element={<DrinkList />} />
            <Route path="/setting/hourly" element={<HourlyRatePage />} />
            <Route path="/setting" element={<SettingsList />} />
            <Route path="/setting/cutoff" element={<CutoffDatePage />} />
            <Route path="/salary" element={<SalaryPage />} />
          </Routes>
        </main>
        <Footer selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </Router>
    </div>
  );
}

export default App;
