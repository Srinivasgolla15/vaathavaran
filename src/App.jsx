import './App.css'
import Button from '@mui/material/Button';
import SearchBox from './searchBox';
import InfoBox from './infoBox';
import History from './history';
import { Routes, Route } from "react-router-dom";

function App() {
   

  return (
    <>
        <Routes>
            <Route path="/" element={<InfoBox />} />
            <Route path="/history" element={<History />} />
        </Routes>
    </>
  )
}

export default App
