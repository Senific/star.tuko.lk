'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Crown, Camera, User, MapPin, FileText, Check, 
  Upload, X, AlertCircle, ArrowLeft, ArrowRight 
} from 'lucide-react';
import { districts, provinces } from '@/data/locations';

type Step = 1 | 2 | 3;

interface FormData {
  fullName: string;
  dateOfBirth: string;
  nic: string;
  districtId: string;
  height: string;
  bio: string;
  talents: string;
  profilePhoto: File | null;
  photos: File[];
  video: File | null;
  agreeTerms: boolean;
}

export default function RegisterPage() {
  const { user, isAuthenticated, login } = useAuth();
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: user?.name || '',
    dateOfBirth: '',
    nic: '',
    districtId: '',
    height: '',
    bio: '',
    talents: '',
    profilePhoto: null,
    photos: [],
    video: null,
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="pt-20 lg:pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <Crown className="h-20 w-20 text-royal-gold-400 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-white mb-4">
            {t('register.title')}
          </h1>
          <p className="text-white/60 mb-8">
            You need to login with Tuko to register as a contestant in Beauty 2026.
          </p>
          <button onClick={login} className="btn-primary text-lg px-10 py-4">
            {t('nav.login')}
          </button>
        </div>
      </div>
    );
  }

  // If already submitted
  if (submitted) {
    return (
      <div className="pt-20 lg:pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-4">
            Application Submitted!
          </h1>
          <p className="text-white/60 mb-8">
            Thank you for registering! We will review your application within 24-48 hours. 
            You'll receive a notification on Tuko once approved.
          </p>
          <a href="/" className="btn-primary">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const validateStep = (step: Step): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.nic.trim()) newErrors.nic = 'NIC number is required';
      if (!formData.districtId) newErrors.districtId = 'Please select your district';
      if (!formData.height.trim()) newErrors.height = 'Height is required';
      
      // Age validation (18-28)
      if (formData.dateOfBirth) {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18 || age > 28) {
          newErrors.dateOfBirth = 'You must be between 18-28 years old';
        }
      }
    }

    if (step === 2) {
      if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
      if (formData.photos.length < 2) newErrors.photos = 'Please upload at least 2 additional photos';
      if (!formData.bio.trim()) newErrors.bio = 'Please write something about yourself';
      if (formData.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters';
    }

    if (step === 3) {
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3) as Step);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  // Upload files to server and get URLs
  const uploadFiles = async (files: File[], type: 'photo' | 'video'): Promise<string[]> => {
    if (files.length === 0) return [];
    
    const formDataUpload = new FormData();
    files.forEach(file => formDataUpload.append('files', file));
    formDataUpload.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formDataUpload,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload files');
    }

    const result = await response.json();
    return result.urls;
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Split fullName into firstName and lastName
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || firstName;

      // Get province from district
      const district = districts.find(d => d.id === formData.districtId);
      const provinceId = district?.provinceId || '';

      // Upload profile photo
      let profilePhotoUrl = '/placeholder.svg';
      if (formData.profilePhoto) {
        const profileUrls = await uploadFiles([formData.profilePhoto], 'photo');
        if (profileUrls.length > 0) {
          profilePhotoUrl = profileUrls[0];
        }
      }

      // Upload additional photos
      let photoUrls: string[] = [];
      if (formData.photos.length > 0) {
        photoUrls = await uploadFiles(formData.photos, 'photo');
      }

      // Upload video if provided
      let videoUrl: string | null = null;
      if (formData.video) {
        const videoUrls = await uploadFiles([formData.video], 'video');
        if (videoUrls.length > 0) {
          videoUrl = videoUrls[0];
        }
      }

      // Prepare data for API
      const registrationData = {
        firstName,
        lastName,
        dateOfBirth: formData.dateOfBirth,
        phone: user?.phone || '',
        email: '', // Optional
        bio: formData.bio,
        districtId: formData.districtId,
        provinceId,
        profilePhoto: profilePhotoUrl,
        photos: photoUrls,
        videoUrl,
        height: parseInt(formData.height) || null,
        talents: formData.talents.split(',').map(t => t.trim()).filter(Boolean),
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      console.log('Registration successful:', result);
      setSubmitted(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ 
        agreeTerms: error.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profilePhoto' | 'photos' | 'video') => {
    const files = e.target.files;
    if (!files) return;

    if (field === 'profilePhoto') {
      setFormData(prev => ({ ...prev, profilePhoto: files[0] }));
    } else if (field === 'photos') {
      const newPhotos = Array.from(files).slice(0, 5 - formData.photos.length);
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    } else if (field === 'video') {
      setFormData(prev => ({ ...prev, video: files[0] }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const steps = [
    { num: 1, label: t('register.step1'), icon: User },
    { num: 2, label: t('register.step2'), icon: Camera },
    { num: 3, label: t('register.step3'), icon: FileText },
  ];

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <Crown className="h-12 w-12 text-royal-gold-400 mx-auto mb-4" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
            {t('register.title')}
          </h1>
          <p className="text-white/60">Join Beauty 2026 and compete for the crown!</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, index) => (
            <React.Fragment key={step.num}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentStep >= step.num 
                    ? 'bg-royal-gold-500 text-deep-purple-900' 
                    : 'bg-white/10 text-white/40'
                }`}>
                  {currentStep > step.num ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm hidden sm:block ${
                  currentStep >= step.num ? 'text-white' : 'text-white/40'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 sm:w-20 h-0.5 mx-2 ${
                  currentStep > step.num ? 'bg-royal-gold-500' : 'bg-white/10'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div className="card-glow p-6 md:p-8">
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-semibold text-white mb-6">
                {t('register.step1')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm mb-2">{t('register.full_name')} *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             focus:outline-none focus:border-royal-gold-500/50"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">{t('register.date_of_birth')} *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             focus:outline-none focus:border-royal-gold-500/50"
                  />
                  {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">NIC Number *</label>
                  <input
                    type="text"
                    value={formData.nic}
                    onChange={(e) => setFormData(prev => ({ ...prev, nic: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             focus:outline-none focus:border-royal-gold-500/50"
                    placeholder="Enter NIC number"
                  />
                  {errors.nic && <p className="text-red-400 text-xs mt-1">{errors.nic}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">{t('register.district')} *</label>
                  <select
                    value={formData.districtId}
                    onChange={(e) => setFormData(prev => ({ ...prev, districtId: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             focus:outline-none focus:border-royal-gold-500/50 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-deep-purple-900">Select your district</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.id} className="bg-deep-purple-900">
                        {district.name[language]}
                      </option>
                    ))}
                  </select>
                  {errors.districtId && <p className="text-red-400 text-xs mt-1">{errors.districtId}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Height *</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             focus:outline-none focus:border-royal-gold-500/50"
                    placeholder="e.g., 5'6&quot; or 168cm"
                  />
                  {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Talents & Hobbies</label>
                  <input
                    type="text"
                    value={formData.talents}
                    onChange={(e) => setFormData(prev => ({ ...prev, talents: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             focus:outline-none focus:border-royal-gold-500/50"
                    placeholder="e.g., Dancing, Singing, Photography"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Photos & Video */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-semibold text-white mb-6">
                {t('register.step2')}
              </h2>

              {/* Profile Photo */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Profile Photo * (Face clearly visible)</label>
                <div className="flex items-start space-x-4">
                  {formData.profilePhoto ? (
                    <div className="relative">
                      <img 
                        src={URL.createObjectURL(formData.profilePhoto)} 
                        alt="Profile" 
                        className="w-32 h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, profilePhoto: null }))}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-32 h-40 border-2 border-dashed border-white/20 rounded-lg 
                                    flex flex-col items-center justify-center cursor-pointer 
                                    hover:border-royal-gold-500/50 transition-colors">
                      <Upload className="h-8 w-8 text-white/40 mb-2" />
                      <span className="text-white/40 text-xs">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-white/40 text-sm">
                    <p>• Clear headshot photo</p>
                    <p>• Good lighting</p>
                    <p>• Face clearly visible</p>
                  </div>
                </div>
                {errors.profilePhoto && <p className="text-red-400 text-xs mt-1">{errors.profilePhoto}</p>}
              </div>

              {/* Additional Photos */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Additional Photos * (Min 2, Max 5)
                </label>
                <div className="flex flex-wrap gap-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={URL.createObjectURL(photo)} 
                        alt={`Photo ${index + 1}`} 
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {formData.photos.length < 5 && (
                    <label className="w-24 h-32 border-2 border-dashed border-white/20 rounded-lg 
                                    flex flex-col items-center justify-center cursor-pointer 
                                    hover:border-royal-gold-500/50 transition-colors">
                      <Upload className="h-6 w-6 text-white/40 mb-1" />
                      <span className="text-white/40 text-xs">Add</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, 'photos')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {errors.photos && <p className="text-red-400 text-xs mt-1">{errors.photos}</p>}
              </div>

              {/* Video (Optional) */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Introduction Video (Optional - 30-60 seconds)
                </label>
                {formData.video ? (
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <span className="text-white">{formData.video.name}</span>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, video: null }))}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center p-6 border-2 border-dashed 
                                  border-white/20 rounded-lg cursor-pointer hover:border-royal-gold-500/50 transition-colors">
                    <Upload className="h-6 w-6 text-white/40 mr-2" />
                    <span className="text-white/40">Upload video (MP4, max 50MB)</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, 'video')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-white/80 text-sm mb-2">{t('register.bio')} * (Min 50 characters)</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                           focus:outline-none focus:border-royal-gold-500/50 resize-none"
                  placeholder="Tell us about yourself, your dreams, and why you want to be Beauty 2026..."
                />
                <p className="text-white/40 text-xs mt-1">{formData.bio.length}/500 characters</p>
                {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-semibold text-white mb-6">
                {t('register.step3')}
              </h2>

              {/* Summary */}
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  {formData.profilePhoto && (
                    <img 
                      src={URL.createObjectURL(formData.profilePhoto)} 
                      alt="Profile" 
                      className="w-20 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-white text-lg">{formData.fullName}</h3>
                    <p className="text-white/60 text-sm">
                      {districts.find(d => d.id === formData.districtId)?.name[language]}
                    </p>
                    <p className="text-white/40 text-sm">{formData.height}</p>
                  </div>
                </div>

                <div>
                  <p className="text-white/40 text-xs mb-1">Bio</p>
                  <p className="text-white/80 text-sm">{formData.bio}</p>
                </div>

                {formData.talents && (
                  <div>
                    <p className="text-white/40 text-xs mb-1">Talents</p>
                    <p className="text-white/80 text-sm">{formData.talents}</p>
                  </div>
                )}

                <div>
                  <p className="text-white/40 text-xs mb-2">Photos ({formData.photos.length + 1})</p>
                  <div className="flex space-x-2">
                    {formData.profilePhoto && (
                      <img 
                        src={URL.createObjectURL(formData.profilePhoto)} 
                        alt="Profile" 
                        className="w-12 h-16 object-cover rounded"
                      />
                    )}
                    {formData.photos.map((photo, index) => (
                      <img 
                        key={index}
                        src={URL.createObjectURL(photo)} 
                        alt={`Photo ${index + 1}`} 
                        className="w-12 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>

                {formData.video && (
                  <div>
                    <p className="text-white/40 text-xs mb-1">Video</p>
                    <p className="text-white/80 text-sm">✓ {formData.video.name}</p>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-white/30 bg-white/5 text-royal-gold-500 
                           focus:ring-royal-gold-500 focus:ring-offset-0"
                />
                <label htmlFor="terms" className="text-white/70 text-sm">
                  I confirm that I am between 18-28 years old, a Sri Lankan citizen, and I agree to the{' '}
                  <a href="/terms" className="text-royal-gold-400 hover:underline">Terms & Conditions</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-royal-gold-400 hover:underline">Privacy Policy</a>
                  {' '}of Beauty 2026.
                </label>
              </div>
              {errors.agreeTerms && <p className="text-red-400 text-xs">{errors.agreeTerms}</p>}

              {/* Important Note */}
              <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200/80">
                  <p className="font-semibold text-yellow-400 mb-1">Important</p>
                  <p>Your application will be reviewed within 24-48 hours. You'll receive a notification on Tuko once approved. False information may result in disqualification.</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button onClick={handleNext} className="btn-primary flex items-center space-x-2">
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-deep-purple-900 border-t-transparent rounded-full" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{t('register.submit')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
