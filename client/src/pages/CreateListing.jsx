import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '../components/ui/alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const CreateListing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    gameType: '',
    price: '',
    description: '',
    
    // Step 2: Account Details
    accountLevel: '',
    serverRegion: '',
    specialFeatures: '',
    
    // Step 3: Images
    images: []
  });

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // Remove image from selection
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Append text data
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append images
      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('/api/listings', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      const data = await response.json();
      navigate(`/listings/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate current step
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.gameType && formData.price;
      case 2:
        return formData.accountLevel && formData.serverRegion;
      case 3:
        return formData.images.length > 0;
      default:
        return false;
    }
  };

  // Navigation between steps
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  // Render different form steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., Level 100 Genshin Impact Account"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Game Type <span className="text-red-500">*</span>
              </label>
              <select
                name="gameType"
                value={formData.gameType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Game</option>
                <option value="genshin_impact">Genshin Impact</option>
                <option value="valorant">Valorant</option>
                <option value="csgo">CS:GO</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter price"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="4"
                placeholder="Describe your account (achievements, items, etc.)"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Account Details</h2>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Account Level <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="accountLevel"
                value={formData.accountLevel}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., Level 50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Server Region <span className="text-red-500">*</span>
              </label>
              <select
                name="serverRegion"
                value={formData.serverRegion}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Region</option>
                <option value="na">North America</option>
                <option value="eu">Europe</option>
                <option value="asia">Asia</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Special Features
              </label>
              <textarea
                name="specialFeatures"
                value={formData.specialFeatures}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="4"
                placeholder="List any rare items, characters, or achievements"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upload Images</h2>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Account Screenshots <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-500">
                Upload screenshots of your account, inventory, or special items
              </p>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`flex-1 h-2 ${
                step <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className={currentStep >= 1 ? 'text-blue-500' : 'text-gray-500'}>
            Basic Info
          </span>
          <span className={currentStep >= 2 ? 'text-blue-500' : 'text-gray-500'}>
            Account Details
          </span>
          <span className={currentStep >= 3 ? 'text-blue-500' : 'text-gray-500'}>
            Images
          </span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto flex items-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Creating...
                </>
              ) : (
                'Create Listing'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateListing;