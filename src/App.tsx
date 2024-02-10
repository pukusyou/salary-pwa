import React from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from './components/Calendar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App" style={{ height: "100vh" }}>
      <Calendar />
      <Footer />
    </div>
  );
}

export default App;
