import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";

const USER_NAME_KEY = "weather-user-name";
const USER_ID_KEY = "weather-user-id";
const API_BASE = import.meta.env.VITE_API_URL || "";

function getUserInfo() {
    let userName = localStorage.getItem(USER_NAME_KEY) || "guest";
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        userId = `user-${encodeURIComponent(userName.trim() || "guest")}-${Date.now()}`;
        localStorage.setItem(USER_ID_KEY, userId);
    }

    return { userName, userId };
}

export default function SearchBox({updateWeather}) {
    const navigate = useNavigate();
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "64762f58bfc9df7651def64e208e8ec2";
    let [city, setCity] = useState("");
    let [userName, setUserName] = useState(localStorage.getItem(USER_NAME_KEY) || "guest");

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

        const { userId } = getUserInfo();
        const searchUrl = `${API_BASE}/search`;

        await fetch(searchUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                city: weather.city,
                country: weather.country,
                temperature: weather.temp,
                userId
            })
        });

        
    }

    let handleChange = (e)=>{
        setCity(e.target.value);
    }

    let handleSubmit = (e)=>{
        e.preventDefault();
        console.log(city);
        localStorage.setItem(USER_NAME_KEY, userName.trim() || "guest");
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
            <TextField label="User name" variant="outlined" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <TextField label="City name" variant="outlined" value={city} onChange={handleChange} />
            <Button variant="contained" onClick={handleSubmit}>
                Search
            </Button>
            <Link to="/history">History</Link>
        </div>

    );
}