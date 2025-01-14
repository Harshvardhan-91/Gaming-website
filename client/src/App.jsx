import React from 'react'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes , Route } from 'react-router-dom';
import Home from './pages/Home';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
