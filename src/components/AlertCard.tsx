import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Alert {
  _id: string;
  helpType: 'danger' | 'warning' | 'safe' | 'info';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

interface AlertCardProps {
  alert: Alert;
  language: 'en' | 'hi';
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, language }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case 'safe':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      default:
        return <Clock className="h-6 w-6 text-blue-600" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'danger':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'safe':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getSeverityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    
    const text = {
      en: { high: 'High', medium: 'Medium', low: 'Low' },
      hi: { high: 'उच्च', medium: 'मध्यम', low: 'कम' }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {text[language][priority as keyof typeof text['en']]}
      </span>
    );
  };

  return (
    <div>
      <div className={`border-2 rounded-lg p-4 ${getAlertStyle(alert.helpType)} transition-all hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getAlertIcon(alert.helpType)}
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <h3 className="font-semibold text-gray-900">{alert.title}</h3>
            {getSeverityBadge(alert.priority)}
          </div>
          <p className="text-gray-700 mt-2">{alert.description}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-2">
            <span className="text-sm text-gray-600">📍 {alert.location}</span>
            <span className="text-sm text-gray-500">{alert.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  
    </div>
  );
};

export default AlertCard;