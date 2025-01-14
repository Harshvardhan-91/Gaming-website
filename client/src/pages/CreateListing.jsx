import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Trash2, Plus, ChevronRight, 
  AlertCircle, CheckCircle2, Image as ImageIcon
} from 'lucide-react';

const CreateListing = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    gameType: '',
    price: '',
    description: '',
    features: [''],
    level: '',
    rank: '',
    accountAge: '',
    skins: '',
    accountDetails: {
      username: '',
      email: '',
      password: ''
    }
  });

  const gameTypes = [
    "Valorant",
    "CS:GO",
    "PUBG",
    "Fortnite",
    "League of Legends",
    "Dota 2",
    "Minecraft",
    "Roblox",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(prev => prev + 1);
      return;
    }
    // TODO: Handle final submission
    navigate('/listing/new-listing-id');
  };

  const renderProgressBar = () => (
    <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
      <div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full 
                 transition-all duration-500"
        style={{ width: `${(step / 3) * 100}%` }}
      />
    </div>
  );

  const BasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Listing Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Rare Valorant Account with Premium Skins"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                   outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Game Type
        </label>
        <select
          value={formData.gameType}
          onChange={(e) => setFormData(prev => ({ ...prev, gameType: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                   outline-none transition-all"
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
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          placeholder="Enter price"
          min="0"
          step="0.01"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                   outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your account in detail..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                   outline-none transition-all"
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
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                         outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl 
                         transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
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
          type="number"
          value={formData.level}
          onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
          placeholder="Enter account level"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                   outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Rank
        </label>
        <input
          type="text"
          value={formData.rank}
          onChange={(e) => setFormData(prev => ({ ...prev, rank: e.target.value }))}
          placeholder="e.g., Diamond II"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                   outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Age
        </label>
        <input
          type="text"
          value={formData.accountAge}
          onChange={(e) => setFormData(prev => ({ ...prev, accountAge: e.target.value }))}
          placeholder="e.g., 2 years"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                   outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Skins/Items
        </label>
        <input
          type="number"
          value={formData.skins}
          onChange={(e) => setFormData(prev => ({ ...prev, skins: e.target.value }))}
          placeholder="Enter number of skins"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                   outline-none transition-all"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-xl">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-600 mb-1">Important Note</h4>
            <p className="text-sm text-blue-600/80">
              Account credentials will be securely stored and only shared with the 
              buyer after successful payment verification.
            </p>
          </div>
        </div>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
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

        {renderProgressBar()}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            {step === 1 && <BasicInfo />}
            {step === 2 && <AccountDetails />}
            {step === 3 && <ImageUpload />}

            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 
                           rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 
                         to-purple-600 text-white rounded-xl hover:opacity-90 
                         transition-all font-medium flex items-center justify-center 
                         gap-2"
              >
                {step === 3 ? (
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;