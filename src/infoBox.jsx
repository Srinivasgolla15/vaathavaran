import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import SearchBox from './searchBox';
import { useState } from "react";

export default function InfoBox() {

    let [weatherInfo, setWeatherInfo] = useState({});

    let updateWeather = (newInfo) => {
        setWeatherInfo(newInfo);
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            marginTop: "40px"
        }}>

            {/* 🔍 SearchBox at top */}
            <SearchBox updateWeather={updateWeather} />

            {/* 🌤 Weather Card */}
            <Card sx={{ maxWidth: 400, width: "100%", textAlign: "center", boxShadow: 3 }}>

                <CardMedia
                    sx={{ height: 180 }}
                    image="https://images.unsplash.com/photo-1502082553048-f009c37129b9"
                    title="weather"
                />

                <CardContent>

                    <Typography variant="h5" gutterBottom>
                        {weatherInfo.city
                            ? `Weather in ${weatherInfo.city}`
                            : "Search a city"}
                    </Typography>

                    {weatherInfo.description && (
                        // <Typography>Description: {weatherInfo.description}</Typography>
                        <Typography variant="h5">
                            {weatherInfo.description?.includes("rain") && "🌧️"}
                            {weatherInfo.description?.includes("clear") && "☀️"}
                            {weatherInfo.description?.includes("cloud") && "☁️"}
                            {weatherInfo.city &&  weatherInfo.description}
                            </Typography>
                    )}

                    {weatherInfo.temp && (
                        <Typography>Temperature: {weatherInfo.temp}°C</Typography>
                    )}

                    {weatherInfo.humidity && (
                        <Typography>Humidity: {weatherInfo.humidity}%</Typography>
                    )}

                    {weatherInfo.tempmax && weatherInfo.tempmin && (
                        <Typography>
                            Range: {weatherInfo.tempmin}°C - {weatherInfo.tempmax}°C
                        </Typography>
                    )}

                    {weatherInfo.feelsLike && (
                        <Typography>Feels Like: {weatherInfo.feelsLike}°C</Typography>
                    )}

                    {weatherInfo.country && (
                        <Typography>Country: {weatherInfo.country}</Typography>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}