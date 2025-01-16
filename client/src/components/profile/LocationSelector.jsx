import React from 'react';
import { MapPin } from 'lucide-react';

const LocationSelector = ({ location, onChange }) => {
  // Mock data for countries and cities
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' }
  ];

  // Cities could be fetched based on selected country
  const cities = {
    US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    GB: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
    CA: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    AU: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    IN: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata']
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <div className="relative">
          <select
            value={location.country}
            onChange={(e) => onChange({ ...location, country: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 
                     rounded-lg focus:ring-2 focus:ring-blue-100 
                     focus:border-blue-500"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {location.country && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            value={location.city}
            onChange={(e) => onChange({ ...location, city: e.target.value })}
            className="w-full px-4 py-2 bg-white border border-gray-200 
                     rounded-lg focus:ring-2 focus:ring-blue-100 
                     focus:border-blue-500"
          >
            <option value="">Select City</option>
            {cities[location.country]?.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;