import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './components/Home';
import DrinkList from './components/DrinkList';
import './App.css';
import React from 'react';
function App() {
  const [selectedItem, setSelectedItem] = React.useState('home');

  return (
    <div className="App all">

      <Router>
        <main>
        <Routes>
          <Route path='/salary-pwa/' element={<Home />}/>
          <Route path='/salary-pwa/setting/' element={<DrinkList />}/>
        </Routes>
        </main>
        <Footer selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
      </Router>


    </div>
  );
}

export default App;
