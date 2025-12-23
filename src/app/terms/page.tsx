'use client';

import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = 'December 22, 2025';

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using the Beauty 2026 website (star.tuko.lk) and participating in the Beauty 2026 contest, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services or participate in the contest.`
    },
    {
      title: '2. Eligibility Requirements',
      content: `To participate as a contestant in Beauty 2026, you must:
      
• Be a Sri Lankan citizen
• Be between 18-28 years of age at the time of registration
• Have a valid Tuko account
• Not be a professional model signed to a modeling agency
• Not have won a national-level beauty pageant previously
• Provide accurate and truthful information during registration
• Submit authentic photographs that have not been digitally altered to misrepresent appearance`
    },
    {
      title: '3. Voting Rules',
      content: `• Only registered Tuko users may vote
• Each user is allowed ONE vote per contestant throughout the competition
• Votes cannot be changed or transferred once cast
• Users may vote for multiple different contestants (one vote each)
• Voting is open island-wide - users can vote for contestants from any district
• Any attempt to manipulate votes through fake accounts, bots, or other means will result in disqualification
• The organizers reserve the right to remove suspicious votes`
    },
    {
      title: '4. Competition Structure',
      content: `Beauty 2026 consists of three rounds:
      
District Round: Top contestant from each of the 25 districts advances (100% public votes)

Province Round: District winners compete for 9 province titles (50% public votes + 50% judge scores)

National Finale: Province queens compete for the Beauty 2026 crown (50% public votes + 50% judge scores)

The organizers reserve the right to modify the competition structure if necessary.`
    },
    {
      title: '5. Contestant Conduct',
      content: `Contestants agree to:
      
• Maintain respectful and professional behavior throughout the competition
• Not engage in any activity that could bring the competition into disrepute
• Not make false claims about themselves or other contestants
• Not solicit votes through misleading or fraudulent means
• Respond to official communications from the organizers in a timely manner
• Attend any required virtual or physical events if selected for advanced rounds

Violation of these conduct rules may result in immediate disqualification.`
    },
    {
      title: '6. Content & Intellectual Property',
      content: `By submitting photos, videos, and other content to Beauty 2026:
      
• You confirm that you own the rights to all submitted content
• You grant Beauty 2026 and Tuko a non-exclusive, royalty-free license to use, display, and promote your content across all platforms
• Your content may be used for promotional purposes during and after the competition
• You will not submit any content that is offensive, inappropriate, or violates any laws
• The organizers reserve the right to remove any content that violates these terms`
    },
    {
      title: '7. Prizes',
      content: `Prize Structure:
      
• Beauty 2026 Queen: Rs. 500,000 + Crown + Modeling opportunities
• 1st Runner-up: Rs. 200,000 + Sash
• 2nd Runner-up: Rs. 100,000 + Sash
• Province Queens (9): Rs. 25,000 each + Certificate
• District Queens (25): Rs. 10,000 each + Certificate
• People's Choice Award: Rs. 50,000

Prizes are non-transferable and cannot be exchanged for cash alternatives. Winners are responsible for any applicable taxes. Prize amounts may be subject to change.`
    },
    {
      title: '8. Disqualification',
      content: `The organizers may disqualify any contestant who:
      
• Provides false or misleading information
• Uses fake accounts or bots to generate votes
• Engages in harassment or inappropriate behavior
• Violates any of these Terms and Conditions
• Brings the competition into disrepute

Disqualification decisions are final and not subject to appeal.`
    },
    {
      title: '9. Privacy',
      content: `Your personal information is collected and processed in accordance with our Privacy Policy. By participating, you consent to:
      
• Collection of your personal data for competition purposes
• Display of your profile publicly on the Beauty 2026 website
• Communication via Tuko app and email regarding competition updates
• Photography and video recording during official events`
    },
    {
      title: '10. Limitation of Liability',
      content: `Beauty 2026 and its organizers:
      
• Are not responsible for technical failures, internet connectivity issues, or other circumstances beyond our control
• Are not liable for any indirect, incidental, or consequential damages
• Reserve the right to cancel, modify, or suspend the competition at any time
• Make no guarantees regarding career outcomes or opportunities resulting from participation`
    },
    {
      title: '11. Changes to Terms',
      content: `We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued participation after changes constitutes acceptance of the new terms.`
    },
    {
      title: '12. Contact Information',
      content: `For questions about these Terms and Conditions, please contact:
      
Email: info@star.tuko.lk
Website: star.tuko.lk/contact`
    },
  ];

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-royal-gold-400 mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            Terms & Conditions
          </h1>
          <p className="text-white/60">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Important Notice */}
        <div className="glass-card p-6 mb-10 flex items-start space-x-4">
          <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-400 mb-1">Important</h3>
            <p className="text-white/70 text-sm">
              Please read these terms carefully before registering or voting in Beauty 2026. 
              By using our services, you agree to be bound by these terms.
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="card-glow p-6">
              <h2 className="font-display text-lg font-semibold text-royal-gold-400 mb-4">
                {section.title}
              </h2>
              <div className="text-white/70 whitespace-pre-line text-sm leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center text-white/40 text-sm">
          <p>© 2026 Beauty 2026. All rights reserved.</p>
          <p className="mt-2">
            Questions? <a href="/contact" className="text-royal-gold-400 hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}
