import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Card, 
    CardContent, 
    Box,
    Grid,
    Chip,
    CircularProgress,
    Button
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';

interface WeatherHistory {
  city: string;
  country: string;
  temperature: number;
  searchedAt: string;
}

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

export default function History() {
    const [history, setHistory] = useState<WeatherHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const deviceId = getDeviceId();
        const historyUrl = `${API_BASE}/history?deviceId=${encodeURIComponent(deviceId)}`;

        fetch(historyUrl)
            .then(response => response.json())
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching history:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading history...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button 
                    component={Link} 
                    to="/" 
                    startIcon={<ArrowBack />}
                    sx={{ mr: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                    Search History
                </Typography>
            </Box>
            
            {history.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No search history available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Start searching for weather to see your history here
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 3,
                    justifyContent: 'center'
                }}>
                    {history.map((item, index) => (
                        <Box 
                            key={index} 
                            sx={{ 
                                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' },
                                minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: '250px' }
                            }}
                        >
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                                            {item.city}
                                        </Typography>
                                        <Chip 
                                            label={`${item.temperature}°C`} 
                                            color="primary" 
                                            size="small"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {item.country}
                                    </Typography>
                                    
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(item.searchedAt).toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            )}
        </Container>
    );
}