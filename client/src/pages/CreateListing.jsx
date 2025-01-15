import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Trash2, Plus, ChevronRight, 
  AlertCircle, CheckCircle2, Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    gameType: '',
    price: '',
    description: '',
    features: [''],
    details: {
      level: '',
      rank: '',
      accountAge: '',
      skins: ''
    }
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/create-listing' } });
    }
  }, [user, navigate]);

  const gameTypes = [
    "Valorant",
    "CSGO",
    "PUBG",
    "Fortnite",
    "League of Legends",
    "Other"
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 6));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].url);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? value : feature
      )
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData };
      if (name.startsWith('details.')) {
        const field = name.split('.')[1];
        newData.details = {
          ...newData.details,
          [field]: value
        };
      } else {
        newData[name] = value;
      }
      return newData;
    });
  };

  const validateForm = () => {
    if (step === 1) {
      if (!formData.title || formData.title.length < 10) {
        setError('Title must be at least 10 characters long');
        return false;
      }
      if (!formData.gameType) {
        setError('Please select a game type');
        return false;
      }
      if (!formData.price || formData.price <= 0) {
        setError('Please enter a valid price');
        return false;
      }
      if (!formData.description || formData.description.length < 50) {
        setError('Description must be at least 50 characters long');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (step < 3) {
      if (validateForm()) {
        setStep(prev => prev + 1);
      }
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);
    try {
      // Create FormData for multipart/form-data request
      const formDataToSend = new FormData();

      // Append all form fields as a single JSON string in the 'data' field
      const listingData = {
        title: formData.title.trim(),
        gameType: formData.gameType,
        price: Number(formData.price),
        description: formData.description.trim(),
        features: formData.features.filter(f => f.trim()),
        details: {
          level: formData.details.level,
          rank: formData.details.rank,
          accountAge: formData.details.accountAge,
          skins: formData.details.skins
        }
      };

      formDataToSend.append('data', JSON.stringify(listingData));

      // Append all images with unique keys
      images.forEach((image, index) => {
        formDataToSend.append(`image${index}`, image.file);
      });

      // Send request to create listing
      const response = await api.post('/listings', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to the new listing
      navigate(`/listing/${response.data.listing._id}`);
    } catch (err) {
      console.error('Error creating listing:', err);
      // Check if there's a specific validation error
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map(error => error.msg)
          .join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.error || 'Error creating listing. Please try again.');
      }
      setLoading(false);
    }
  };

  const BasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Listing Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Rare Valorant Account with Premium Skins"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Game Type
        </label>
        <select
          name="gameType"
          value={formData.gameType}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Select Game Type</option>
          {gameTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price (USD)
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your account in detail..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Features
        </label>
        <div className="space-y-3">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="e.g., Rare Battle Pass Items"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 
                     font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Feature
          </button>
        </div>
      </div>
    </div>
  );

  const AccountDetails = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Level
        </label>
        <input
          type="text"
          name="details.level"
          value={formData.details.level}
          onChange={handleChange}
          placeholder="Enter account level"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Rank
        </label>
        <input
          type="text"
          name="details.rank"
          value={formData.details.rank}
          onChange={handleChange}
          placeholder="Enter account rank"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Age
        </label>
        <input
          type="text"
          name="details.accountAge"
          value={formData.details.accountAge}
          onChange={handleChange}
          placeholder="How old is the account?"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Skins
        </label>
        <input
          type="text"
          name="details.skins"
          value={formData.details.skins}
          onChange={handleChange}
          placeholder="How many skins does the account have?"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>
  );

  const ImageUpload = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={image.url}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white 
                       rounded-full opacity-0 group-hover:opacity-100 
                       transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {images.length < 6 && (
          <label className="aspect-square border-2 border-dashed border-gray-300 
                         rounded-xl hover:border-blue-500 transition-colors 
                         cursor-pointer flex flex-col items-center justify-center 
                         gap-2 text-gray-500 hover:text-blue-500">
            <ImageIcon className="w-8 h-8" />
            <span className="text-sm font-medium">Add Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
      <p className="text-sm text-gray-500">
        Upload up to 6 clear images of your account. Include screenshots of 
        inventory, stats, and notable features.
      </p>
    </div>
  );

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
          <p className="text-gray-600">
            Step {step} of 3: {
              step === 1 ? 'Basic Information' :
              step === 2 ? 'Account Details' :
              'Upload Images'
            }
          </p>
        </div>

        <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && <BasicInfo />}
            {step === 2 && <AccountDetails />}
            {step === 3 && <ImageUpload />}

            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 
                           rounded-xl hover:bg-gray-50 transition-colors font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 
                         to-purple-600 text-white rounded-xl hover:opacity-90 
                         transition-all font-medium flex items-center justify-center 
                         gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {step === 3 ? 'Creating...' : 'Loading...'}
                  </>
                ) : step === 3 ? (
                  <>
                    Create Listing
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;