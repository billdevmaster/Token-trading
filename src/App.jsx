/* eslint-disable no-unused-vars */
import './App.css';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import Tokens from './components/Tokens';
import Header from './components/Header';
import Setting from './components/Setting';

function App() {
  return (
    <>
      <Router>
        <div className='max-w-7xl m-auto'>
          <Header />
          <Routes>
            <Route exact path="/" element={<Tokens />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
