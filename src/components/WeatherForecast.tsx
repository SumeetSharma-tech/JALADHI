
import React from 'react';
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
  const forecastData: WeatherDay[] = [
    {
      date: 'Today',
      temp: { max: 32, min: 24 },
      condition: 'Heavy Rain',
      icon: 'rain',
      safety: 'danger',
      safetyMessage: language === 'en' 
        ? 'Avoid travel - Heavy rainfall and flooding expected'
        : 'यात्रा से बचें - भारी बारिश और बाढ़ की संभावना'
    },
    {
      date: 'Tomorrow',
      temp: { max: 30, min: 23 },
      condition: 'Moderate Rain',
      icon: 'rain',
      safety: 'caution',
      safetyMessage: language === 'en'
        ? 'Exercise caution - Roads may be waterlogged'
        : 'सावधानी बरतें - सड़कें जलभराव हो सकती हैं'
    },
    {
      date: 'Day 3',
      temp: { max: 28, min: 22 },
      condition: 'Cloudy',
      icon: 'cloudy',
      safety: 'caution',
      safetyMessage: language === 'en'
        ? 'Light showers possible - Keep umbrella handy'
        : 'हल्की बारिश संभावित - छाता साथ रखें'
    },
    {
      date: 'Day 4',
      temp: { max: 31, min: 25 },
      condition: 'Partly Sunny',
      icon: 'sun',
      safety: 'safe',
      safetyMessage: language === 'en'
        ? 'Good weather conditions - Safe for travel'
        : 'अच्छे मौसम की स्थिति - यात्रा के लिए सुरक्षित'
    },
    {
      date: 'Day 5',
      temp: { max: 33, min: 26 },
      condition: 'Sunny',
      icon: 'sun',
      safety: 'safe',
      safetyMessage: language === 'en'
        ? 'Clear skies - Excellent for outdoor activities'
        : 'साफ आसमान - बाहरी गतिविधियों के लिए उत्कृष्ट'
    }
  ];

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