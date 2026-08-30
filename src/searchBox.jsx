import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";

const DEVICE_KEY = "weather-device-id";
const API_BASE = import.meta.env.VITE_API_URL || "";

function getDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_KEY);

    if (!deviceId) {
        deviceId = crypto.randomUUID ? crypto.randomUUID() : `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        localStorage.setItem(DEVICE_KEY, deviceId);
    }

    return deviceId;
}

export default function SearchBox({updateWeather}) {
    const navigate = useNavigate();
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "64762f58bfc9df7651def64e208e8ec2";
    let [city, setCity] = useState("");

    let fetchWeather = async (city) => {
        let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        console.log(data);
        let weather = {
            temp : data.main.temp,
            description : data.weather[0].description,
            icon : data.weather[0].icon,
            humidity: data.main.humidity,
            tempmax: data.main.temp_max,
            tempmin: data.main.temp_min ,
            feelsLike: data.main.feels_like,
            city: data.name,
            country: data.sys.country
        }
        console.log(weather);
        updateWeather(weather);

        const deviceId = getDeviceId();
        const searchUrl = `${API_BASE}/search`;

        await fetch(searchUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                city: weather.city,
                country: weather.country,
                temperature: weather.temp,
                deviceId
            })
        });

        
    }

    let handleChange = (e)=>{
        setCity(e.target.value);
    }

    let handleSubmit = (e)=>{
        e.preventDefault();
        console.log(city);
        fetchWeather(city);
        setCity("");
        
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column", 
            alignItems: "center",
            gap: "20px",
            marginTop: "20px"
        }}>
            <h3> Search for the Weather</h3>
            <TextField label="City name" variant="outlined" value={city} onChange={handleChange} />
            <Button variant="contained" onClick={handleSubmit}>
                Search
            </Button>
            <Link to="/history">History</Link>
        </div>

    );
}