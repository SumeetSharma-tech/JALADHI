import React, { useState } from 'react';
import { Heart, Send, MapPin, Phone, User, AlertCircle } from 'lucide-react';

interface HelpRequestProps {
  language: 'en' | 'hi';
  selectedLocation: string;
}

const HelpRequest: React.FC<HelpRequestProps> = ({ language, selectedLocation }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: selectedLocation,
    helpType: '',
    urgency: 'medium',
    description: '',
    peopleAffected: ''
  });

  const [images, setImages] = useState<File[]>([]); // Added image state
  const [submitted, setSubmitted] = useState(false);

  const text = {
    en: {
      title: 'Request Emergency Help',
      subtitle: 'Fill out this form if you need immediate assistance',
      name: 'Full Name',
      phone: 'Phone Number',
      location: 'Exact Location/Address',
      helpType: 'Type of Help Needed',
      helpOptions: {
        food: 'Food & Water',
        medical: 'Medical Aid',
        shelter: 'Shelter/Accommodation',
        transport: 'Transportation',
        money: 'Financial Aid',
        rescue: 'Rescue/Evacuation',
        other: 'Other'
      },
      urgency: 'Urgency Level',
      urgencyOptions: {
        high: 'Life Threatening (Immediate)',
        medium: 'Urgent (Within 24 hrs)',
        low: 'Non-urgent (48+ hrs)'
      },
      description: 'Detailed Description',
      peopleAffected: 'Number of People Affected',
      submit: 'Submit Help Request',
      success: 'Help request submitted successfully! Someone will contact you soon.',
      required: 'Required field',
      uploadImages: 'Upload Images (Optional)'
    },
    hi: {
      title: 'आपातकालीन सहायता का अनुरोध',
      subtitle: 'यदि आपको तत्काल सहायता की आवश्यकता है तो यह फॉर्म भरें',
      name: 'पूरा नाम',
      phone: 'फोन नंबर',
      location: 'सटीक स्थान/पता',
      helpType: 'आवश्यक सहायता का प्रकार',
      helpOptions: {
        food: 'भोजन और पानी',
        medical: 'चिकित्सा सहायता',
        shelter: 'आश्रय/आवास',
        transport: 'परिवहन',
        money: 'वित्तीय सहायता',
        rescue: 'बचाव/निकासी',
        other: 'अन्य'
      },
      urgency: 'तात्कालिकता स्तर',
      urgencyOptions: {
        high: 'जीवन संकट (तत्काल)',
        medium: 'तत्काल (24 घंटे में)',
        low: 'गैर-तत्काल (48+ घंटे)'
      },
      description: 'विस्तृत विवरण',
      peopleAffected: 'प्रभावित लोगों की संख्या',
      submit: 'सहायता अनुरोध जमा करें',
      success: 'सहायता अनुरोध सफलतापूर्वक जमा किया गया! कोई व्यक्ति जल्द ही आपसे संपर्क करेगा।',
      required: 'आवश्यक फ़ील्ड',
      uploadImages: 'छवियाँ अपलोड करें (वैकल्पिक)'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("https://hackethon-2-93vy.onrender.com/aidRequest/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        helpType: formData.helpType,
        urgency: formData.urgency,
        description: formData.description,
        peopleAffected: Number(formData.peopleAffected),
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("❌ Server error:", err);
      alert("Failed to submit help request: " + err.message);
      return;
    }

    const data = await response.json();
    console.log("✅ Help request submitted successfully:", data);

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({
      name: "",
      phone: "",
      location: selectedLocation,
      helpType: "",
      urgency: "medium",
      description: "",
      peopleAffected: "",
    });
    setImages([]);
  } catch (error) {
    console.error("⚠️ Error submitting help request:", error);
    alert("Something went wrong while submitting your request.");
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">{text[language].title}</h2>
          <p className="text-green-600">{text[language].success}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 p-3 rounded-lg">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{text[language].title}</h2>
          <p className="text-gray-600">{text[language].subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Phone */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              {text[language].name} *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={text[language].name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              {text[language].phone} *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-2" />
            {text[language].location} *
          </label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Street, Area, City, State"
          />
        </div>

        {/* Help Type & Urgency */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text[language].helpType} *
            </label>
            <select
              name="helpType"
              required
              value={formData.helpType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select help type</option>
              {Object.entries(text[language].helpOptions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text[language].urgency} *
            </label>
            <select
              name="urgency"
              required
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {Object.entries(text[language].urgencyOptions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        {/* People Affected */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {text[language].peopleAffected}
          </label>
          <input
            type="number"
            name="peopleAffected"
            min="1"
            value={formData.peopleAffected}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="1"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {text[language].description} *
          </label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Describe your situation in detail..."
          />
        </div>

        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Send className="h-5 w-5" />
          {text[language].submit}
        </button>
      </form>
    </div>
  );
};

export default HelpRequest;
