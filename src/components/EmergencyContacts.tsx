import React from 'react';
import { Phone, MapPin, Clock, Users } from 'lucide-react';

interface EmergencyContactsProps {
  language: 'en' | 'hi';
  selectedLocation: string;
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ language, selectedLocation }) => {
  const emergencyNumbers = [
    {
      service: language === 'en' ? 'Police' : 'पुलिस',
      number: '100',
      description: language === 'en' ? 'For crimes, accidents, and general emergencies' : 'अपराध, दुर्घटनाएं और सामान्य आपातकाल के लिए'
    },
    {
      service: language === 'en' ? 'Fire Brigade' : 'दमकल',
      number: '101',
      description: language === 'en' ? 'For fire emergencies and rescue operations' : 'आग की आपातकाल और बचाव कार्यों के लिए'
    },
    {
      service: language === 'en' ? 'Ambulance' : 'एम्बुलेंस',
      number: '108',
      description: language === 'en' ? 'For medical emergencies and ambulance services' : 'चिकित्सा आपातकाल और एम्बुलेंस सेवाओं के लिए'
    },
    {
      service: language === 'en' ? 'Disaster Management' : 'आपदा प्रबंधन',
      number: '1077',
      description: language === 'en' ? 'For natural disasters and emergency response' : 'प्राकृतिक आपदाओं और आपातकालीन प्रतिक्रिया के लिए'
    },
    {
      service: language === 'en' ? 'Women Helpline' : 'महिला हेल्पलाइन',
      number: '1091',
      description: language === 'en' ? 'For women in distress and safety concerns' : 'संकट में महिलाओं और सुरक्षा चिंताओं के लिए'
    },
    {
      service: language === 'en' ? 'Child Helpline' : 'चाइल्ड हेल्पलाइन',
      number: '1098',
      description: language === 'en' ? 'For children in need of care and protection' : 'देखभाल और सुरक्षा की जरूरत वाले बच्चों के लिए'
    }
  ];

  const localServices = [
    {
      name: language === 'en' ? 'District Collector Office' : 'जिला कलेक्टर कार्यालय',
      phone: '+91 22 2266 0001',
      address: selectedLocation || 'Your District',
      hours: '24/7',
      type: 'government'
    },
    {
      name: language === 'en' ? 'Local Relief Center' : 'स्थानीय राहत केंद्र',
      phone: '+91 22 2266 0002',
      address: selectedLocation || 'Your Area',
      hours: '24/7',
      type: 'relief'
    },
    {
      name: language === 'en' ? 'Nearest Hospital' : 'निकटतम अस्पताल',
      phone: '+91 22 2266 0003',
      address: selectedLocation || 'Your City',
      hours: '24/7',
      type: 'medical'
    }
  ];

  const text = {
    en: {
      title: 'Emergency Contacts',
      subtitle: 'Important numbers and local services for emergencies',
      nationalNumbers: 'National Emergency Numbers',
      localServices: 'Local Emergency Services',
      callNow: 'Call Now',
      hours: 'Hours',
      address: 'Address',
      available247: 'Available 24/7'
    },
    hi: {
      title: 'आपातकालीन संपर्क',
      subtitle: 'आपातकाल के लिए महत्वपूर्ण नंबर और स्थानीय सेवाएं',
      nationalNumbers: 'राष्ट्रीय आपातकालीन नंबर',
      localServices: 'स्थानीय आपातकालीन सेवाएं',
      callNow: 'अभी कॉल करें',
      hours: 'समय',
      address: 'पता',
      available247: '24/7 उपलब्ध'
    }
  };

  return (
    
<div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{text[language].title}</h2>
        <p className="text-gray-600">{text[language].subtitle}</p>
      </div>

      {/* National Emergency Numbers */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{text[language].nationalNumbers}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyNumbers.map((contact, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{contact.service}</h4>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-bold">
                  {text[language].available247}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{contact.description}</p>
              <a
                href={`tel:${contact.number}`}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 w-full"
              >
                <Phone className="h-4 w-4" />
                {contact.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Local Services */}
      {selectedLocation && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{text[language].localServices}</h3>
          <div className="space-y-4">
            {localServices.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{service.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{service.hours}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`tel:${service.phone}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    {text[language].callNow}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">
              {language === 'en' ? 'Emergency Calling Tips' : 'आपातकालीन कॉलिंग टिप्स'}
            </p>
            <ul className="space-y-1 text-xs">
              <li>
                {language === 'en' 
                  ? '• Stay calm and speak clearly'
                  : '• शांत रहें और स्पष्ट बोलें'
                }
              </li>
              <li>
                {language === 'en' 
                  ? '• Provide your exact location'
                  : '• अपना सटीक स्थान बताएं'
                }
              </li>
              <li>
                {language === 'en' 
                  ? '• Describe the emergency briefly'
                  : '• आपातकाल का संक्षेप में वर्णन करें'
                }
              </li>
              <li>
                {language === 'en' 
                  ? '• Follow the operator\'s instructions'
                  : '• ऑपरेटर के निर्देशों का पालन करें'
                }
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default EmergencyContacts;