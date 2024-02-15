import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import DrinkList from "./components/DrinkList";
import "./App.css";
import React from "react";
import SettingsList from "./components/SettingList";
import HourlyRatePage from "./components/HourlyRatePage";
function App() {
  const [selectedItem, setSelectedItem] = React.useState("home");

  return (
    <div className="App all">
      <Router>
        <main>
          <Routes>
            <Route path="/salary-pwa/" element={<Home />} />
            <Route path="/salary-pwa/setting/drink" element={<DrinkList />} />
            <Route
              path="/salary-pwa/setting/hourly"
              element={<HourlyRatePage />}
            />
            <Route path="/salary-pwa/setting" element={<SettingsList />} />
          </Routes>
        </main>
        <Footer selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </Router>
    </div>
  );
}

export default App;
