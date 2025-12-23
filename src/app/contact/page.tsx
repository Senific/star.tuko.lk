'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Replace with actual contact form submission
    console.log('Contact form:', formData);
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-20 lg:pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-4">
            Message Sent!
          </h1>
          <p className="text-white/60 mb-8">
            Thank you for contacting us. We'll get back to you within 24-48 hours.
          </p>
          <button 
            onClick={() => setSubmitted(false)} 
            className="btn-secondary"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <MessageCircle className="h-16 w-16 text-royal-gold-400 mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            {t('footer.contact')}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Have questions about Beauty 2026? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card-glow p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-royal-gold-500/20 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-royal-gold-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Email</h3>
                  <p className="text-white/60 text-sm">info@star.tuko.lk</p>
                </div>
              </div>
            </div>

            <div className="card-glow p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-royal-gold-500/20 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-royal-gold-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Phone</h3>
                  <p className="text-white/60 text-sm">+94 XX XXX XXXX</p>
                </div>
              </div>
            </div>

            <div className="card-glow p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-royal-gold-500/20 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-royal-gold-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Location</h3>
                  <p className="text-white/60 text-sm">Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>

            <div className="card-glow p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-royal-gold-500/20 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-royal-gold-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Response Time</h3>
                  <p className="text-white/60 text-sm">24-48 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card-glow p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold text-white mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:border-royal-gold-500/50"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Subject *</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             focus:outline-none focus:border-royal-gold-500/50 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-deep-purple-900">Select a subject</option>
                    <option value="registration" className="bg-deep-purple-900">Registration Help</option>
                    <option value="voting" className="bg-deep-purple-900">Voting Questions</option>
                    <option value="technical" className="bg-deep-purple-900">Technical Issues</option>
                    <option value="sponsorship" className="bg-deep-purple-900">Sponsorship Inquiry</option>
                    <option value="media" className="bg-deep-purple-900">Media & Press</option>
                    <option value="other" className="bg-deep-purple-900">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             focus:outline-none focus:border-royal-gold-500/50 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-deep-purple-900 border-t-transparent rounded-full" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
