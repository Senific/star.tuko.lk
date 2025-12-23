'use client';

import React from 'react';
import { Shield, Eye, Lock, Database, Share2, Bell, Trash2, Mail } from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = 'December 22, 2025';

  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, including:

Personal Information (for contestants):
• Full name and date of birth
• National Identity Card (NIC) number
• District and province of residence
• Contact information (phone number, email)
• Physical attributes (height)
• Photographs and videos
• Biography and talents information

Account Information (for all users):
• Tuko user ID and profile data
• Login and authentication data

Usage Information:
• Voting history and preferences
• Pages viewed and interactions
• Device and browser information
• IP address and location data`
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `We use the information we collect to:

• Operate and manage the Beauty 2026 competition
• Process contestant registrations and verify eligibility
• Display contestant profiles publicly on our website
• Track and record votes accurately
• Communicate competition updates and results
• Prevent fraud and ensure fair competition
• Improve our website and user experience
• Comply with legal obligations

For contestants, your profile information (name, photos, bio, district) will be publicly displayed on the Beauty 2026 website and may be shared on social media for promotional purposes.`
    },
    {
      icon: Share2,
      title: 'Information Sharing',
      content: `We may share your information with:

Tuko: As our authentication partner, Tuko has access to your account data used for login purposes.

Service Providers: Third-party services that help us operate the competition (hosting, analytics, etc.)

Legal Requirements: When required by law, court order, or government request.

Business Transfers: In the event of a merger, acquisition, or sale of assets.

We do NOT sell your personal information to third parties for marketing purposes.`
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: `We implement appropriate security measures to protect your information:

• Encrypted data transmission (HTTPS)
• Secure authentication via Tuko OAuth
• Regular security audits and monitoring
• Access controls and authentication for staff
• Secure data storage with backups

However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.`
    },
    {
      icon: Bell,
      title: 'Communications',
      content: `By using Beauty 2026, you may receive:

• Push notifications via Tuko app (competition updates, results)
• Email communications (registration confirmation, important announcements)
• SMS notifications for urgent matters

You can manage your notification preferences in the Tuko app settings. However, you cannot opt out of essential communications related to your participation in the competition.`
    },
    {
      icon: Trash2,
      title: 'Data Retention & Deletion',
      content: `We retain your information for as long as:

• Your account is active
• Necessary to provide our services
• Required by legal obligations

After the competition ends:
• Contestant profiles may remain publicly visible as part of competition history
• Vote records are retained for verification purposes
• You may request deletion of your personal data by contacting us

To request data deletion, email us at info@star.tuko.lk with subject "Data Deletion Request".`
    },
  ];

  const rights = [
    'Access your personal information',
    'Correct inaccurate information',
    'Request deletion of your data',
    'Object to certain data processing',
    'Withdraw consent (where applicable)',
    'Request a copy of your data',
  ];

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-royal-gold-400 mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/60">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="card-glow p-6 mb-10">
          <p className="text-white/70 leading-relaxed">
            Beauty 2026 ("we", "us", or "our") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you visit our website (star.tuko.lk) and participate in the 
            Beauty 2026 competition. Please read this policy carefully.
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="card-glow p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-royal-gold-500/20 p-2 rounded-lg">
                  <section.icon className="h-5 w-5 text-royal-gold-400" />
                </div>
                <h2 className="font-display text-lg font-semibold text-white">
                  {section.title}
                </h2>
              </div>
              <div className="text-white/70 whitespace-pre-line text-sm leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Your Rights */}
        <div className="card-glow p-6 mt-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4">
            Your Rights
          </h2>
          <p className="text-white/70 text-sm mb-4">
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rights.map((right, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-royal-gold-500 rounded-full" />
                <span className="text-white/70">{right}</span>
              </div>
            ))}
          </div>
          <p className="text-white/50 text-sm mt-4">
            To exercise these rights, contact us at info@star.tuko.lk
          </p>
        </div>

        {/* Cookies */}
        <div className="card-glow p-6 mt-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4">
            Cookies & Tracking
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            We use cookies and similar tracking technologies to:
          </p>
          <ul className="mt-3 space-y-2 text-white/70 text-sm">
            <li>• Remember your language preference</li>
            <li>• Keep you logged in via Tuko authentication</li>
            <li>• Analyze website traffic and usage patterns</li>
            <li>• Prevent fraudulent voting activity</li>
          </ul>
          <p className="text-white/50 text-sm mt-4">
            You can control cookies through your browser settings, but disabling them may 
            affect website functionality.
          </p>
        </div>

        {/* Children's Privacy */}
        <div className="card-glow p-6 mt-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4">
            Children's Privacy
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Beauty 2026 is not intended for individuals under 18 years of age. We do not 
            knowingly collect personal information from children under 18. If you believe 
            we have collected information from a minor, please contact us immediately.
          </p>
        </div>

        {/* Contact */}
        <div className="card-glow p-6 mt-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-royal-gold-500/20 p-2 rounded-lg">
              <Mail className="h-5 w-5 text-royal-gold-400" />
            </div>
            <h2 className="font-display text-lg font-semibold text-white">
              Contact Us
            </h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="text-white/70">
              <strong className="text-royal-gold-400">Email:</strong> info@star.tuko.lk
            </p>
            <p className="text-white/70">
              <strong className="text-royal-gold-400">Website:</strong> star.tuko.lk/contact
            </p>
          </div>
        </div>

        {/* Changes Notice */}
        <div className="mt-10 glass-card p-6 text-center">
          <p className="text-white/60 text-sm">
            We may update this Privacy Policy from time to time. We will notify you of any 
            changes by posting the new Privacy Policy on this page and updating the 
            "Last updated" date.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-white/40 text-sm">
          <p>© 2026 Beauty 2026. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
