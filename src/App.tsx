import React, { useState } from 'react';
import Header from './components/Header';
import AlertCard from './components/AlertCard';
import HelpRequest from './components/HelpRequest';
import AidProvision from './components/AidProvision';
import WeatherForecast from './components/WeatherForecast';
import EmergencyContacts from './components/EmergencyContacts';
import ChatIcon from './components/ChatIcon';
import { useEffect } from 'react';

interface Alert {
  _id: string;
  helpType: "danger" | "warning" | "info";
  title: string;
  description: string;
  location: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
}


function App() {
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState('alerts');

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };


  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  // Sample alert data
  const initialAlerts: Alert[] = [
    {
      _id: '15',
      helpType: 'danger',
      title: language === 'en' ? 'Heavy Rainfall Alert' : 'भारी बारिश अलर्ट',
      description: language === 'en'
        ? 'Extremely heavy rainfall expected in next 24 hours. Flooding likely in low-lying areas.'
        : 'अगले 24 घंटों में अत्यधिक भारी बारिश की उम्मीद। निचले इलाकों में बाढ़ की संभावना।',
      location: selectedLocation || 'Mumbai',
      timestamp: '2 hours ago',
      priority: 'high'
    },
    {
      _id: '12',
      helpType: 'warning',
      title: language === 'en' ? 'Transportation Disrupted' : 'परिवहन में बाधा',
      description: language === 'en'
        ? 'Local trains and buses suspended due to waterlogging. Use alternative routes.'
        : 'जलभराव के कारण स्थानीय ट्रेनों और बसों का संचालन बंद। वैकल्पिक रास्ते का उपयोग करें।',
      location: selectedLocation || 'Mumbai',
      timestamp: '4 hours ago',
      priority: 'medium'
    },
    {
      _id: '19',
      helpType: 'info',
      title: language === 'en' ? 'Relief Centers Operational' : 'राहत केंद्र संचालित',
      description: language === 'en'
        ? 'Temporary relief centers have been set up. Food and shelter available.'
        : 'अस्थायी राहत केंद्र स्थापित किए गए हैं। भोजन और आश्रय उपलब्ध है।',
      location: selectedLocation || 'Mumbai',
      timestamp: '6 hours ago',
      priority: 'low'
    },
    {
      _id: '17',
      helpType: 'info',
      title: language === 'en' ? 'Relief Centers Operational' : 'राहत केंद्र संचालित',
      description: language === 'en'
        ? 'Temporary relief centers have been set up. Food and shelter available.'
        : 'अस्थायी राहत केंद्र स्थापित किए गए हैं। भोजन और आश्रय उपलब्ध है।',
      location: selectedLocation || 'Mumbai',
      timestamp: '6 hours ago',
      priority: 'low'
    },
    {
      _id: '15',
      helpType: 'info',
      title: language === 'en' ? 'Relief Centers Operational' : 'राहत केंद्र संचालित',
      description: language === 'en'
        ? 'Temporary relief centers have been set up. Food and shelter available.'
        : 'अस्थायी राहत केंद्र स्थापित किए गए हैं। भोजन और आश्रय उपलब्ध है।',
      location: selectedLocation || 'Mumbai',
      timestamp: '6 hours ago',
      priority: 'low'
    }
  ];

  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [loading, setLoading] = useState(false);

  // Function to map backend severity to frontend helpType
  const mapSeverityToHelpType = (severity: string): "danger" | "warning" | "info" => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
      default:
        return 'info';
    }
  };

  // Function to map severity to priority
  const mapSeverityToPriority = (severity: string): "high" | "medium" | "low" => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'high';
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
      default:
        return 'low';
    }
  };

  // Function to format timestamp
  const formatTimestamp = (dateString: string): string => {
    const now = new Date();
    const alertTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        
        // Fetch alerts based on selected location if available, otherwise get all alerts
        const endpoint = selectedLocation 
          ? `https://hackethon-2-93vy.onrender.com/disasterAlert/alerts/${encodeURIComponent(selectedLocation)}`
          : `https://hackethon-2-93vy.onrender.com/disasterAlert/alerts`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform backend data to frontend format
        const transformedAlerts: Alert[] = data.alerts.map((alert: any) => ({
          _id: alert._id,
          helpType: mapSeverityToHelpType(alert.severity),
          title: alert.title,
          description: alert.description || '',
          location: alert.location?.address || selectedLocation || 'Unknown',
          timestamp: formatTimestamp(alert.reportedAt),
          priority: mapSeverityToPriority(alert.severity)
        }));

        setAlerts(() => {
          // Combine backend alerts with initial static alerts
          const combined = [...transformedAlerts, ...initialAlerts];
          // Create a Map to store unique alerts by _id
          const uniqueMap = new Map<string, Alert>();
          combined.forEach(alert => {
            uniqueMap.set(alert._id, alert);
          });
          // Return array of unique alerts
          return Array.from(uniqueMap.values());
        });
        
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
        // Keep initial alerts on error
        setAlerts(initialAlerts);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [selectedLocation, language]); // Re-fetch when location or language changes



  
  


  const tabs = [
    { id: 'alerts', name: language === 'en' ? 'Current Alerts' : 'वर्तमान अलर्ट' },
    { id: 'request-help', name: language === 'en' ? 'Request Help' : 'सहायता मांगें' },
    { id: 'provide-aid', name: language === 'en' ? 'Provide Aid' : 'सहायता दें' },
    { id: 'weather', name: language === 'en' ? 'Weather Forecast' : 'मौसम पूर्वानुमान' },
    { id: 'contacts', name: language === 'en' ? 'Emergency Contacts' : 'आपातकालीन संपर्क' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        selectedLocation={selectedLocation}
        language={language}
        onLocationChange={handleLocationChange}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <ChatIcon />

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {language === 'en' ? 'Current Safety Alerts' : 'वर्तमान सुरक्षा अलर्ट'}
                </h2>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? `Real-time disaster and safety information for ${selectedLocation || 'your area'}`
                    : `${selectedLocation || 'आपके क्षेत्र'} के लिए वास्तविक समय आपदा और सुरक्षा जानकारी`
                  }
                </p>
              </div>
            
              
              {selectedLocation ? (
                loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">
                      {language === 'en' 
                        ? 'Loading alerts...'
                        : 'अलर्ट लोड हो रहे हैं...'
                      }
                    </p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <AlertCard key={alert._id} alert={alert} language={language} />
                  ))
                )
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'Please select a location to view current alerts'
                      : 'वर्तमान अलर्ट देखने के लिए कृपया एक स्थान चुनें'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'request-help' && (
            <HelpRequest language={language} selectedLocation={selectedLocation} />
          )}

          {activeTab === 'provide-aid' && (
            <AidProvision language={language} selectedLocation={selectedLocation} />
          )}

          {activeTab === 'weather' && (
            <WeatherForecast language={language} selectedLocation={selectedLocation} />
          )}

          {activeTab === 'contacts' && (
            <EmergencyContacts language={language} selectedLocation={selectedLocation} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">
            {language === 'en' 
              ? 'India Disaster Alert & Aid Platform - Connecting communities in times of need'
              : 'भारत आपदा चेतावनी और सहायता प्लेटफॉर्म - जरूरत के समय में समुदायों को जोड़ना'
            }
          </p>
          <p className="text-gray-400 text-sm">
            {language === 'en' 
              ? 'For technical support or feedback, contact us at support@disasteraid.in'
              : 'तकनीकी सहायता या फीडबैक के लिए, हमसे support@disasteraid.in पर संपर्क करें'
            }
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;