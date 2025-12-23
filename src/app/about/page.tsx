'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Crown, Calendar, MapPin, Users, Trophy, Star, 
  CheckCircle, XCircle, HelpCircle, Award, Heart
} from 'lucide-react';
import { provinces, districts } from '@/data/locations';

export default function AboutPage() {
  const { language, t } = useLanguage();

  const timeline = [
    { date: 'Mar 20, 2026', title: 'Registration Opens', desc: 'Online registration begins for all districts' },
    { date: 'Apr 20, 2026', title: 'Registration Closes', desc: 'Last day to submit your application' },
    { date: 'Apr 21 - May 21', title: 'District Round', desc: 'Island-wide voting for all contestants' },
    { date: 'May 22, 2026', title: 'District Results', desc: 'Top contestant from each district announced' },
    { date: 'May 25 - Jun 15', title: 'Province Round', desc: 'District winners compete for province title' },
    { date: 'Jun 16, 2026', title: 'Province Results', desc: '9 Province Queens announced' },
    { date: 'Jun 20 - Jul 5', title: 'National Finale', desc: 'Final voting + Judge panel evaluation' },
    { date: 'Jul 6, 2026', title: 'Grand Finale', desc: 'YouTube Live - Beauty 2026 Queen crowned' },
  ];

  const eligibility = [
    { icon: CheckCircle, text: 'Sri Lankan citizen', ok: true },
    { icon: CheckCircle, text: 'Age between 18-28 years', ok: true },
    { icon: CheckCircle, text: 'Must have Tuko account', ok: true },
    { icon: CheckCircle, text: 'Submit clear photos', ok: true },
    { icon: XCircle, text: 'No previous national pageant winners', ok: false },
    { icon: XCircle, text: 'No professional models signed to agencies', ok: false },
  ];

  const prizes = [
    { title: 'Beauty 2026 Queen', prize: 'Rs. 500,000 + Crown + Modeling Contract', icon: Crown },
    { title: '1st Runner-up', prize: 'Rs. 200,000 + Sash', icon: Award },
    { title: '2nd Runner-up', prize: 'Rs. 100,000 + Sash', icon: Award },
    { title: 'Province Queens (9)', prize: 'Rs. 25,000 each + Certificate', icon: Trophy },
    { title: 'District Queens (25)', prize: 'Rs. 10,000 each + Certificate', icon: Star },
    { title: "People's Choice", prize: 'Rs. 50,000 (Most Votes)', icon: Heart },
  ];

  const faqs = [
    {
      q: 'Who can participate in Beauty 2026?',
      a: 'Any Sri Lankan female citizen aged 18-28 years with a Tuko account can participate. You must not be a professional model or previous national pageant winner.',
    },
    {
      q: 'How does voting work?',
      a: 'Only Tuko users can vote. Each user can vote once per contestant. Votes are island-wide - you can vote for contestants from any district.',
    },
    {
      q: 'Is there a registration fee?',
      a: 'No! Registration is completely free for all Tuko users. Simply download Tuko, create an account, and register.',
    },
    {
      q: 'How are winners selected?',
      a: 'District round winners are selected purely by public votes. Province and National rounds combine public votes (50%) with judge panel scores (50%).',
    },
    {
      q: 'Can I update my profile after registration?',
      a: 'Yes, you can update your photos and bio until the registration deadline. After that, profiles are locked.',
    },
    {
      q: 'What happens if I win the district round?',
      a: 'District Queens automatically advance to the Province Round. You\'ll receive Rs. 10,000 cash prize and a certificate.',
    },
  ];

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Crown className="h-16 w-16 text-royal-gold-400 mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            About Beauty 2026
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Sri Lanka's biggest online beauty contest, covering all 25 districts and 9 provinces
          </p>
        </div>

        {/* Timeline */}
        <section className="mb-20">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            <Calendar className="inline h-8 w-8 text-royal-gold-400 mr-3" />
            Event Timeline
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-royal-gold-500/30" />
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-royal-gold-500 rounded-full 
                                transform -translate-x-1/2 z-10" />
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                  }`}>
                    <div className="card-glow p-4 inline-block">
                      <p className="text-royal-gold-400 text-sm font-semibold">{item.date}</p>
                      <h3 className="font-display text-lg font-semibold text-white mt-1">{item.title}</h3>
                      <p className="text-white/60 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Eligibility & Prizes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Eligibility */}
          <section className="card-glow p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="h-6 w-6 text-royal-gold-400 mr-3" />
              Eligibility
            </h2>
            <div className="space-y-4">
              {eligibility.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <item.icon className={`h-5 w-5 ${item.ok ? 'text-green-400' : 'text-red-400'}`} />
                  <span className="text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Prizes */}
          <section className="card-glow p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center">
              <Trophy className="h-6 w-6 text-royal-gold-400 mr-3" />
              Prizes
            </h2>
            <div className="space-y-4">
              {prizes.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <item.icon className={`h-5 w-5 ${
                    index === 0 ? 'text-yellow-400' : 
                    index === 1 ? 'text-gray-300' : 
                    index === 2 ? 'text-amber-600' : 'text-royal-gold-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-white/60 text-sm">{item.prize}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Districts & Provinces */}
        <section className="mb-20">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            <MapPin className="inline h-8 w-8 text-royal-gold-400 mr-3" />
            Participating Districts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {provinces.map(province => (
              <div key={province.id} className="card-glow p-5">
                <h3 className="font-display text-lg font-semibold text-royal-gold-400 mb-3">
                  {province.name[language]}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {province.districts.map(districtId => {
                    const district = districts.find(d => d.id === districtId);
                    return (
                      <span 
                        key={districtId}
                        className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/70"
                      >
                        {district?.name[language]}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            <HelpCircle className="inline h-8 w-8 text-royal-gold-400 mr-3" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card-glow p-5">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-white/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
