
import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface WeatherDay {
  date: string;
  temp: { max: number; min: number };
  condition: string;
  icon: string;
  safety: 'safe' | 'caution' | 'danger';
  safetyMessage: string;
}

interface WeatherForecastProps {
  language: 'en' | 'hi';
  selectedLocation: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ language, selectedLocation }) => {
  const [forecastData, setForecastData] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to map weather condition to icon
  const mapWeatherToIcon = (weatherMain: string): string => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return 'sun';
      case 'clouds':
        return 'cloudy';
      case 'rain':
      case 'drizzle':
        return 'rain';
      case 'snow':
        return 'snow';
      default:
        return 'cloudy';
    }
  };

  // Function to determine safety level based on weather
  const getSafetyLevel = (weatherMain: string, windSpeed: number = 0): 'safe' | 'caution' | 'danger' => {
    const weather = weatherMain.toLowerCase();
    
    if (weather === 'rain' && windSpeed > 10) return 'danger';
    if (weather === 'rain' || weather === 'drizzle' || weather === 'thunderstorm') return 'caution';
    if (weather === 'snow' || weather === 'fog' || weather === 'mist') return 'caution';
    if (windSpeed > 15) return 'danger';
    if (windSpeed > 8) return 'caution';
    
    return 'safe';
  };

  // Function to get safety message
  const getSafetyMessage = (safety: 'safe' | 'caution' | 'danger', weatherCondition: string): string => {
    const condition = weatherCondition.toLowerCase();
    
    if (safety === 'danger') {
      return language === 'en' 
        ? `Avoid travel - Severe ${condition} conditions expected`
        : `यात्रा से बचें - गंभीर ${condition} की स्थिति अपेक्षित`;
    }
    
    if (safety === 'caution') {
      return language === 'en'
        ? `Exercise caution - ${condition} conditions, drive carefully`
        : `सावधानी बरतें - ${condition} की स्थिति, सावधानी से ड्राइव करें`;
    }
    
    return language === 'en'
      ? 'Good weather conditions - Safe for travel'
      : 'अच्छे मौसम की स्थिति - यात्रा के लिए सुरक्षित';
  };

  // Fetch weather data from backend
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!selectedLocation) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch 5-day forecast from backend
        const response = await fetch(`https://hackethon-2-93vy.onrender.com/disasterAlert/forecast/${encodeURIComponent(selectedLocation)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the forecast data
        const processedData: WeatherDay[] = data.dailyForecasts.slice(0, 5).map((day: any, index: number) => {
          // Get the first forecast of the day (usually around noon for better accuracy)
          const mainForecast = day.forecasts[Math.floor(day.forecasts.length / 2)] || day.forecasts[0];
          
          // Calculate min/max temperatures for the day
          const temps = day.forecasts.map((f: any) => f.main.temp);
          const maxTemp = Math.round(Math.max(...temps));
          const minTemp = Math.round(Math.min(...temps));
          
          const weatherMain = mainForecast.weather[0].main;
          const weatherDescription = mainForecast.weather[0].description;
          const icon = mapWeatherToIcon(weatherMain);
          const safety = getSafetyLevel(weatherMain);
          
          let dateLabel = '';
          if (index === 0) {
            dateLabel = 'Today';
          } else if (index === 1) {
            dateLabel = 'Tomorrow';
          } else {
            dateLabel = `Day ${index + 1}`;
          }
          
          return {
            date: dateLabel,
            temp: { max: maxTemp, min: minTemp },
            condition: weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1),
            icon: icon,
            safety: safety,
            safetyMessage: getSafetyMessage(safety, weatherDescription)
          };
        });
        
        setForecastData(processedData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Fallback to default data if API fails
        setForecastData([
          {
            date: 'Today',
            temp: { max: 25, min: 18 },
            condition: 'Partly Cloudy',
            icon: 'cloudy',
            safety: 'safe',
            safetyMessage: language === 'en' 
              ? 'Weather data unavailable - Check local conditions'
              : 'मौसम डेटा उपलब्ध नहीं - स्थानीय स्थितियों की जांच करें'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedLocation, language]);

  const text = {
    en: {
      title: '5-Day Weather Forecast & Travel Safety',
      subtitle: `Weather conditions and safety advice for ${selectedLocation || 'your area'}`,
      today: 'Today',
      tomorrow: 'Tomorrow',
      noLocation: 'Please select a location to view weather forecast',
      travelAdvice: 'Travel Safety Advice',
      generalAdvice: {
        safe: 'Weather conditions are favorable for travel and outdoor activities.',
        caution: 'Exercise caution during travel. Keep emergency supplies ready.',
        danger: 'Avoid unnecessary travel. Stay indoors and stay safe.'
      }
    },
    hi: {
      title: '5-दिन मौसम पूर्वानुमान और यात्रा सुरक्षा',
      subtitle: `${selectedLocation || 'आपके क्षेत्र'} के लिए मौसम स्थितियां और सुरक्षा सलाह`,
      today: 'आज',
      tomorrow: 'कल',
      noLocation: 'मौसम पूर्वानुमान देखने के लिए कृपया स्थान चुनें',
      travelAdvice: 'यात्रा सुरक्षा सलाह',
      generalAdvice: {
        safe: 'मौसम की स्थिति यात्रा और बाहरी गतिविधियों के लिए अनुकूल है।',
        caution: 'यात्रा के दौरान सावधानी बरतें। आपातकालीन आपूर्ति तैयार रखें।',
        danger: 'अनावश्यक यात्रा से बचें। घर के अंदर रहें और सुरक्षित रहें।'
      }
    }
  };

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sun':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="h-8 w-8 text-blue-300" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getSafetyIcon = (safety: string) => {
    switch (safety) {
      case 'safe':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'caution':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case 'danger':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      default:
        return <CheckCircle className="h-6 w-6 text-green-600" />;
    }
  };

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'safe':
        return 'border-green-200 bg-green-50';
      case 'caution':
        return 'border-yellow-200 bg-yellow-50';
      case 'danger':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (!selectedLocation) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <Cloud className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">{text[language].noLocation}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <Cloud className="h-16 w-16 mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-gray-500 text-lg">
            {language === 'en' ? 'Loading weather data...' : 'मौसम डेटा लोड हो रहा है...'}
          </p>
        </div>
      </div>
    );
  }

  const overallSafety = forecastData.slice(0, 3).some(day => day.safety === 'danger') 
    ? 'danger' 
    : forecastData.slice(0, 3).some(day => day.safety === 'caution') 
    ? 'caution' 
    : 'safe';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{text[language].title}</h2>
        <p className="text-gray-600">{text[language].subtitle}</p>
      </div>

      {/* Overall Travel Advice */}
      <div className={`border-2 rounded-lg p-4 mb-6 ${getSafetyColor(overallSafety)}`}>
        <div className="flex items-center gap-3 mb-2">
          {getSafetyIcon(overallSafety)}
          <h3 className="text-lg font-semibold text-gray-900">{text[language].travelAdvice}</h3>
        </div>
        <p className="text-gray-700">{text[language].generalAdvice[overallSafety]}</p>
      </div>

      {/* 5-Day Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecastData.map((day, index) => (
          <div key={index} className={`border-2 rounded-lg p-4 ${getSafetyColor(day.safety)}`}>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">
                {index === 0 ? text[language].today : 
                 index === 1 ? text[language].tomorrow : day.date}
              </h4>
              
              <div className="flex justify-center mb-3">
                {getWeatherIcon(day.icon)}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{day.condition}</p>
              
              <div className="flex justify-between text-lg font-bold text-gray-900 mb-3">
                <span>{day.temp.max}°</span>
                <span className="text-gray-500">{day.temp.min}°</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                {getSafetyIcon(day.safety)}
              </div>
              
              <p className="text-xs text-gray-600 text-center">{day.safetyMessage}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">
              {language === 'en' ? 'Weather Advisory' : 'मौसम सलाह'}
            </p>
            <p>
              {language === 'en' 
                ? 'Keep emergency supplies ready: water, food, first aid kit, flashlight, and phone charger. Stay updated with local news and weather alerts.'
                : 'आपातकालीन आपूर्ति तैयार रखें: पानी, भोजन, प्राथमिक चिकित्सा किट, टॉर्च, और फोन चार्जर। स्थानीय समाचार और मौसम अलर्ट के साथ अपडेट रहें।'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;