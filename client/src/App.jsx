import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer,Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home.jsx";
import Results from "./pages/Results.jsx";
import Navbar from './components/Navbar.jsx';

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />

        <Route  
          path="/results"
          element={<Results />}
        />

      </Routes>
    </BrowserRouter>
    <ToastContainer 
      position="top-right"
      autoClose={5000}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Zoom}
    />
    </>      
  )
}

export default App