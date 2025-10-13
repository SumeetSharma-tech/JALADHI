import React, { useEffect, useState } from "react";
import { Users, MapPin, Clock, Phone, Check, Heart } from "lucide-react";

type HelpTypeKeys =
  | "food"
  | "medical"
  | "shelter"
  | "transport"
  | "money"
  | "rescue"
  | "other";

interface HelpRequest {
  id: string;
  name: string;
  phone: string;
  location: string;
  helpType: HelpTypeKeys;
  urgency: "high" | "medium" | "low";
  description: string;
  peopleAffected: number;
  timestamp: string;
  verified: boolean;
}

interface AidProvisionProps {
  language: "en" | "hi";
  selectedLocation: string;
}

const AidProvision: React.FC<AidProvisionProps> = ({
  language,
  selectedLocation,
}) => {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);  

  // ✅ Fetch data properly
  useEffect(() => {
  const fetchHelpRequests = async () => {
    try {
      const res = await fetch("https://hackethon-2-93vy.onrender.com/aidRequest/all");
      const data = await res.json();
      console.log("Raw response:", data);

      if (Array.isArray(data)) {
        const formatted = data.map((item: any) => ({
          id: item._id,
          name: item.name,
          phone: item.phone,
          location: item.location,
          helpType: item.helpType || "other",
          urgency:
            item.priority?.toLowerCase() === "critical"
              ? "high"
              : item.priority?.toLowerCase() === "medium"
              ? "medium"
              : "low",
          description: item.description,
          peopleAffected: item.peopleAffected,
          timestamp: new Date(item.timestamp).toLocaleString(),
          verified: item.verified,
        }));

        setHelpRequests(formatted);
        console.log("Fetched help requests:", formatted);
      }
    } catch (error) {
      console.error("Error fetching help requests:", error);
    }
  };

  fetchHelpRequests();
}, []);


  const [filter, setFilter] = useState<string>("all");
  const [helpedRequests, setHelpedRequests] = useState<Set<string>>(new Set());

  const handleHelpNow = (requestId: string) => {
    setHelpedRequests((prev) => new Set([...prev, requestId]));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getUrgencyBadgeColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const text = {
    en: {
      title: "Provide Aid & Help",
      subtitle: "View verified help requests and provide direct assistance",
      helpNow: "Help Now",
      callNow: "Call Now",
      people: "people affected",
      verified: "Verified Request",
      urgencyLevels: {
        high: "High Priority",
        medium: "Medium Priority",
        low: "Low Priority",
      },
      helpTypes: {
        food: "Food & Water",
        medical: "Medical Aid",
        shelter: "Shelter",
        transport: "Transportation",
        money: "Financial Aid",
        rescue: "Rescue",
        other: "Other",
      },
      noRequests: "No help requests in this area at the moment.",
      helpProvided: "Help provided! Thank you for making a difference.",
      filterBy: "Filter by urgency:",
    },
    hi: {
      title: "सहायता और मदद प्रदान करें",
      subtitle: "सत्यापित सहायता अनुरोध देखें और प्रत्यक्ष सहायता प्रदान करें",
      helpNow: "अभी मदद करें",
      callNow: "अभी कॉल करें",
      people: "लोग प्रभावित",
      verified: "सत्यापित अनुरोध",
      urgencyLevels: {
        high: "उच्च प्राथमिकता",
        medium: "मध्यम प्राथमिकता",
        low: "कम प्राथमिकता",
      },
      helpTypes: {
        food: "भोजन और पानी",
        medical: "चिकित्सा सहायता",
        shelter: "आश्रय",
        transport: "परिवहन",
        money: "वित्तीय सहायता",
        rescue: "बचाव",
        other: "अन्य",
      },
      noRequests: "इस समय इस क्षेत्र में कोई सहायता अनुरोध नहीं है।",
      helpProvided: "सहायता प्रदान की गई! बदलाव लाने के लिए धन्यवाद।",
      filterBy: "तात्कालिकता के आधार पर फ़िल्टर करें:",
    },
  };

  const filteredRequests = helpRequests.filter(
    (request) => filter === "all" || request.urgency === filter
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-3 rounded-lg">
          <Heart className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {text[language].title}
          </h2>
          <p className="text-gray-600">{text[language].subtitle}</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {text[language].filterBy}
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Requests</option>
          <option value="high">{text[language].urgencyLevels.high}</option>
          <option value="medium">{text[language].urgencyLevels.medium}</option>
          <option value="low">{text[language].urgencyLevels.low}</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>{text[language].noRequests}</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`border-2 rounded-lg p-6 ${getUrgencyColor(
                request.urgency
              )} transition-all hover:shadow-md`}
            >
              {helpedRequests.has(request.id) && (
                <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">
                      {text[language].helpProvided}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {request.name}
                    </h3>
                    {request.verified && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        {text[language].verified}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyBadgeColor(
                        request.urgency
                      )}`}
                    >
                      {text[language].urgencyLevels[request.urgency]}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>
                        {request.peopleAffected} {text[language].people}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{request.timestamp}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {text[language].helpTypes[request.helpType]}
                    </span>
                    <p className="text-gray-700">{request.description}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                  <button
                    onClick={() => handleHelpNow(request.id)}
                    disabled={helpedRequests.has(request.id)}
                    className={`px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                      helpedRequests.has(request.id)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    {text[language].helpNow}
                  </button>
                  <a
                    href={`tel:${request.phone}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    {text[language].callNow}
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AidProvision;
