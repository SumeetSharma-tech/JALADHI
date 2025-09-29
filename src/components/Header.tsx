import React from "react";
import { MapPin, Globe, Bell } from "lucide-react";
import IMG from "../../src/assests/12.png";

interface HeaderProps {
  selectedLocation: string;
  language: "en" | "hi";
  onLocationChange: (location: string) => void;
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedLocation,
  language,
  onLocationChange,
  onLanguageToggle,
}) => {
  const locations = [
    "Goa",
    "Kerala",
    "Mumbai",
    "Pondicherry",
    "Kolkata",
    "Chennai",
    "Andaman and Nicobar Islands",
    "Puri",
    "Mangalore",
    "Gujarat",
  ];

  const text = {
    en: {
      title: "India Disaster Alert & Aid Platform",
      location: "Select Location",
      alerts: "Emergency Alerts",
    },
    hi: {
      title: "भारत आपदा चेतावनी और सहायता प्लेटफॉर्म",
      location: "स्थान चुनें",
      alerts: "आपातकालीन अलर्ट",
    },
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center -ml-20">
            <img
              src={IMG}
              alt="Notification Bell"
              className="h-10 w-10 -ml-20 mr-2"
            />
            <div><h1 className="text-lg md:text-xl text-black font-bold ">
  {language === 'en' ? 'Ministry of Earth Sciences' : 'भूमि विज्ञान मंत्रालय'}
</h1>

              <h1 className="text-lg md:text-l text-bwhite font-semibold mr-1 -mt-2">
                {language === "en" ? "Government of India" : "भारत सरकार"}
              </h1>
            </div>

            <div className="flex items-center gap-3 ml-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold">
                {text[language].title}
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/80 focus:bg-white/30 focus:outline-none"
              >
                <option value="">{text[language].location}</option>
                {locations.map((location) => (
                  <option
                    key={location}
                    value={location}
                    className="text-gray-800"
                  >
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors"
            >
              <Globe className="h-5 w-5" />
              <span>{language === "en" ? "हिं" : "EN"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
