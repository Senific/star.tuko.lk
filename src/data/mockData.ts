// Mock data for development - will be replaced with database

export interface Contestant {
  id: string;
  name: string;
  age: number;
  districtId: string;
  provinceId: string;
  profilePhoto: string;
  photos: string[];
  video?: string;
  bio: string;
  height: string;
  talents: string[];
  votes: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  tukoUserId: string;
}

// Sample contestant data with placeholder images
export const mockContestants: Contestant[] = [
  {
    id: '1',
    name: 'Sachini Perera',
    age: 23,
    districtId: 'colombo',
    provinceId: 'western',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop',
    ],
    bio: 'Aspiring model and social media influencer from Colombo. Passionate about fashion and empowering women.',
    height: '5\'7"',
    talents: ['Dancing', 'Modeling', 'Public Speaking'],
    votes: 1542,
    status: 'approved',
    createdAt: '2026-03-20',
    tukoUserId: 'tuko_001',
  },
  {
    id: '2',
    name: 'Nimasha Fernando',
    age: 21,
    districtId: 'gampaha',
    provinceId: 'western',
    profilePhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop',
    ],
    bio: 'University student studying Business Management. Love photography and traveling.',
    height: '5\'5"',
    talents: ['Photography', 'Singing'],
    votes: 1328,
    status: 'approved',
    createdAt: '2026-03-20',
    tukoUserId: 'tuko_002',
  },
  {
    id: '3',
    name: 'Tharushi Silva',
    age: 24,
    districtId: 'kandy',
    provinceId: 'central',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop',
    ],
    bio: 'Traditional dancer from the hill country. Proud to represent Kandyan culture.',
    height: '5\'6"',
    talents: ['Traditional Dance', 'Acting'],
    votes: 1205,
    status: 'approved',
    createdAt: '2026-03-21',
    tukoUserId: 'tuko_003',
  },
  {
    id: '4',
    name: 'Dilhani Rajapakse',
    age: 22,
    districtId: 'galle',
    provinceId: 'southern',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop',
    ],
    bio: 'Beach lover and environmental activist from the beautiful southern coast.',
    height: '5\'8"',
    talents: ['Swimming', 'Environmental Advocacy'],
    votes: 1089,
    status: 'approved',
    createdAt: '2026-03-21',
    tukoUserId: 'tuko_004',
  },
  {
    id: '5',
    name: 'Kavindi Mendis',
    age: 25,
    districtId: 'jaffna',
    provinceId: 'northern',
    profilePhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop',
    ],
    bio: 'Software engineer and classical musician. Breaking stereotypes every day.',
    height: '5\'4"',
    talents: ['Classical Music', 'Coding', 'Bharatanatyam'],
    votes: 987,
    status: 'approved',
    createdAt: '2026-03-22',
    tukoUserId: 'tuko_005',
  },
  {
    id: '6',
    name: 'Sanduni Wickrama',
    age: 20,
    districtId: 'kurunegala',
    provinceId: 'north-western',
    profilePhoto: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop',
    ],
    bio: 'First-year medical student with a passion for helping others.',
    height: '5\'5"',
    talents: ['Volunteering', 'Debating'],
    votes: 856,
    status: 'approved',
    createdAt: '2026-03-22',
    tukoUserId: 'tuko_006',
  },
  {
    id: '7',
    name: 'Hashini Jayawardena',
    age: 26,
    districtId: 'matara',
    provinceId: 'southern',
    profilePhoto: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop',
    ],
    bio: 'Entrepreneur running a successful boutique. Fashion is my language.',
    height: '5\'6"',
    talents: ['Fashion Design', 'Business'],
    votes: 743,
    status: 'approved',
    createdAt: '2026-03-23',
    tukoUserId: 'tuko_007',
  },
  {
    id: '8',
    name: 'Ishara Kumari',
    age: 23,
    districtId: 'anuradhapura',
    provinceId: 'north-central',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
    ],
    bio: 'History enthusiast from the ancient city. Proud of our heritage.',
    height: '5\'5"',
    talents: ['History', 'Tour Guiding', 'Writing'],
    votes: 678,
    status: 'approved',
    createdAt: '2026-03-23',
    tukoUserId: 'tuko_008',
  },
  {
    id: '9',
    name: 'Nethmini Dias',
    age: 21,
    districtId: 'batticaloa',
    provinceId: 'eastern',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop',
    ],
    bio: 'Multilingual content creator bringing Eastern Province to the world.',
    height: '5\'4"',
    talents: ['Content Creation', 'Languages'],
    votes: 612,
    status: 'approved',
    createdAt: '2026-03-24',
    tukoUserId: 'tuko_009',
  },
  {
    id: '10',
    name: 'Malshi Gunathilake',
    age: 24,
    districtId: 'ratnapura',
    provinceId: 'sabaragamuwa',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop',
    ],
    bio: 'Gem trader\'s daughter with a sparkle in her eyes. Nature lover.',
    height: '5\'7"',
    talents: ['Gemology', 'Hiking', 'Yoga'],
    votes: 534,
    status: 'approved',
    createdAt: '2026-03-24',
    tukoUserId: 'tuko_010',
  },
];

// Vote tracking (in real app, this would be in database)
export interface Vote {
  odUserId: string;
  contestantId: string;
  votedAt: string;
}

export const mockVotes: Vote[] = [];

// Check if user has voted for a contestant
export const hasUserVoted = (tukoUserId: string, contestantId: string): boolean => {
  return mockVotes.some(v => v.odUserId === tukoUserId && v.contestantId === contestantId);
};

// Add a vote
export const addVote = (tukoUserId: string, contestantId: string): boolean => {
  if (hasUserVoted(tukoUserId, contestantId)) {
    return false;
  }
  mockVotes.push({
    odUserId: tukoUserId,
    contestantId,
    votedAt: new Date().toISOString(),
  });
  
  // Update contestant votes
  const contestant = mockContestants.find(c => c.id === contestantId);
  if (contestant) {
    contestant.votes += 1;
  }
  
  return true;
};
