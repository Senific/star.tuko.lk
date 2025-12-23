import { PrismaClient, AdminRole, CompetitionRound } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ==================== PROVINCES ====================
  console.log('📍 Seeding provinces...');
  
  const provinces = [
    { id: 'western', nameEn: 'Western', nameSi: 'බස්නාහිර', nameTa: 'மேற்கு', sortOrder: 1 },
    { id: 'central', nameEn: 'Central', nameSi: 'මධ්‍යම', nameTa: 'மத்திய', sortOrder: 2 },
    { id: 'southern', nameEn: 'Southern', nameSi: 'දකුණු', nameTa: 'தெற்கு', sortOrder: 3 },
    { id: 'northern', nameEn: 'Northern', nameSi: 'උතුරු', nameTa: 'வடக்கு', sortOrder: 4 },
    { id: 'eastern', nameEn: 'Eastern', nameSi: 'නැගෙනහිර', nameTa: 'கிழக்கு', sortOrder: 5 },
    { id: 'north-western', nameEn: 'North Western', nameSi: 'වයඹ', nameTa: 'வட மேற்கு', sortOrder: 6 },
    { id: 'north-central', nameEn: 'North Central', nameSi: 'උතුරු මැද', nameTa: 'வட மத்திய', sortOrder: 7 },
    { id: 'uva', nameEn: 'Uva', nameSi: 'ඌව', nameTa: 'ஊவா', sortOrder: 8 },
    { id: 'sabaragamuwa', nameEn: 'Sabaragamuwa', nameSi: 'සබරගමුව', nameTa: 'சபரகமுவா', sortOrder: 9 },
  ];

  for (const province of provinces) {
    await prisma.province.upsert({
      where: { id: province.id },
      update: province,
      create: province,
    });
  }

  // ==================== DISTRICTS ====================
  console.log('📍 Seeding districts...');

  const districts = [
    // Western Province
    { id: 'colombo', nameEn: 'Colombo', nameSi: 'කොළඹ', nameTa: 'கொழும்பு', provinceId: 'western', sortOrder: 1 },
    { id: 'gampaha', nameEn: 'Gampaha', nameSi: 'ගම්පහ', nameTa: 'கம்பஹா', provinceId: 'western', sortOrder: 2 },
    { id: 'kalutara', nameEn: 'Kalutara', nameSi: 'කළුතර', nameTa: 'களுத்துறை', provinceId: 'western', sortOrder: 3 },
    
    // Central Province
    { id: 'kandy', nameEn: 'Kandy', nameSi: 'මහනුවර', nameTa: 'கண்டி', provinceId: 'central', sortOrder: 4 },
    { id: 'matale', nameEn: 'Matale', nameSi: 'මාතලේ', nameTa: 'மாத்தளை', provinceId: 'central', sortOrder: 5 },
    { id: 'nuwara-eliya', nameEn: 'Nuwara Eliya', nameSi: 'නුවරඑළිය', nameTa: 'நுவரெலியா', provinceId: 'central', sortOrder: 6 },
    
    // Southern Province
    { id: 'galle', nameEn: 'Galle', nameSi: 'ගාල්ල', nameTa: 'காலி', provinceId: 'southern', sortOrder: 7 },
    { id: 'matara', nameEn: 'Matara', nameSi: 'මාතර', nameTa: 'மாத்தறை', provinceId: 'southern', sortOrder: 8 },
    { id: 'hambantota', nameEn: 'Hambantota', nameSi: 'හම්බන්තොට', nameTa: 'அம்பாந்தோட்டை', provinceId: 'southern', sortOrder: 9 },
    
    // Northern Province
    { id: 'jaffna', nameEn: 'Jaffna', nameSi: 'යාපනය', nameTa: 'யாழ்ப்பாணம்', provinceId: 'northern', sortOrder: 10 },
    { id: 'kilinochchi', nameEn: 'Kilinochchi', nameSi: 'කිලිනොච්චි', nameTa: 'கிளிநொச்சி', provinceId: 'northern', sortOrder: 11 },
    { id: 'mannar', nameEn: 'Mannar', nameSi: 'මන්නාරම', nameTa: 'மன்னார்', provinceId: 'northern', sortOrder: 12 },
    { id: 'mullaitivu', nameEn: 'Mullaitivu', nameSi: 'මුලතිව්', nameTa: 'முல்லைத்தீவு', provinceId: 'northern', sortOrder: 13 },
    { id: 'vavuniya', nameEn: 'Vavuniya', nameSi: 'වව්නියාව', nameTa: 'வவுனியா', provinceId: 'northern', sortOrder: 14 },
    
    // Eastern Province
    { id: 'ampara', nameEn: 'Ampara', nameSi: 'අම්පාර', nameTa: 'அம்பாறை', provinceId: 'eastern', sortOrder: 15 },
    { id: 'batticaloa', nameEn: 'Batticaloa', nameSi: 'මඩකලපුව', nameTa: 'மட்டக்களப்பு', provinceId: 'eastern', sortOrder: 16 },
    { id: 'trincomalee', nameEn: 'Trincomalee', nameSi: 'ත්‍රිකුණාමලය', nameTa: 'திருகோணமலை', provinceId: 'eastern', sortOrder: 17 },
    
    // North Western Province
    { id: 'kurunegala', nameEn: 'Kurunegala', nameSi: 'කුරුණෑගල', nameTa: 'குருநாகல்', provinceId: 'north-western', sortOrder: 18 },
    { id: 'puttalam', nameEn: 'Puttalam', nameSi: 'පුත්තලම', nameTa: 'புத்தளம்', provinceId: 'north-western', sortOrder: 19 },
    
    // North Central Province
    { id: 'anuradhapura', nameEn: 'Anuradhapura', nameSi: 'අනුරාධපුර', nameTa: 'அனுராதபுரம்', provinceId: 'north-central', sortOrder: 20 },
    { id: 'polonnaruwa', nameEn: 'Polonnaruwa', nameSi: 'පොළොන්නරුව', nameTa: 'பொலன்னறுவை', provinceId: 'north-central', sortOrder: 21 },
    
    // Uva Province
    { id: 'badulla', nameEn: 'Badulla', nameSi: 'බදුල්ල', nameTa: 'பதுளை', provinceId: 'uva', sortOrder: 22 },
    { id: 'monaragala', nameEn: 'Monaragala', nameSi: 'මොණරාගල', nameTa: 'மொணராகலை', provinceId: 'uva', sortOrder: 23 },
    
    // Sabaragamuwa Province
    { id: 'ratnapura', nameEn: 'Ratnapura', nameSi: 'රත්නපුර', nameTa: 'இரத்தினபுரி', provinceId: 'sabaragamuwa', sortOrder: 24 },
    { id: 'kegalle', nameEn: 'Kegalle', nameSi: 'කෑගල්ල', nameTa: 'கேகாலை', provinceId: 'sabaragamuwa', sortOrder: 25 },
  ];

  for (const district of districts) {
    await prisma.district.upsert({
      where: { id: district.id },
      update: district,
      create: district,
    });
  }

  // ==================== ADMIN USERS ====================
  console.log('👤 Seeding admin users...');

  const adminPassword = await bcrypt.hash('admin123', 12);
  const modPassword = await bcrypt.hash('mod123', 12);

  await prisma.admin.upsert({
    where: { email: 'admin@tuko.lk' },
    update: {},
    create: {
      email: 'admin@tuko.lk',
      name: 'Super Admin',
      passwordHash: adminPassword,
      role: AdminRole.SUPER_ADMIN,
    },
  });

  await prisma.admin.upsert({
    where: { email: 'moderator@tuko.lk' },
    update: {},
    create: {
      email: 'moderator@tuko.lk',
      name: 'Moderator',
      passwordHash: modPassword,
      role: AdminRole.MODERATOR,
    },
  });

  // ==================== COMPETITION PHASES ====================
  console.log('🏆 Seeding competition phases...');

  const phases = [
    {
      round: CompetitionRound.REGISTRATION,
      name: 'Registration',
      description: 'Contestants can register and submit applications',
      startDate: new Date('2026-03-20'),
      endDate: new Date('2026-04-20'),
      isActive: true,
      votingEnabled: false,
    },
    {
      round: CompetitionRound.DISTRICT,
      name: 'District Round',
      description: 'Voting for district winners - Top 5 from each district advance',
      startDate: new Date('2026-04-25'),
      endDate: new Date('2026-05-15'),
      isActive: false,
      votingEnabled: true,
    },
    {
      round: CompetitionRound.PROVINCE,
      name: 'Province Round',
      description: 'Voting for province winners - Top 3 from each province advance',
      startDate: new Date('2026-05-20'),
      endDate: new Date('2026-06-10'),
      isActive: false,
      votingEnabled: true,
    },
    {
      round: CompetitionRound.SEMI_FINAL,
      name: 'National Semi-Final',
      description: 'Top 27 contestants compete - Final 10 selected',
      startDate: new Date('2026-06-15'),
      endDate: new Date('2026-06-25'),
      isActive: false,
      votingEnabled: true,
    },
    {
      round: CompetitionRound.FINALE,
      name: 'National Finale',
      description: 'Live YouTube finale - Winner crowned',
      startDate: new Date('2026-07-06'),
      endDate: new Date('2026-07-06'),
      isActive: false,
      votingEnabled: true,
    },
  ];

  for (const phase of phases) {
    await prisma.competitionPhase.upsert({
      where: { round: phase.round },
      update: phase,
      create: phase,
    });
  }

  // ==================== DEFAULT SETTINGS ====================
  console.log('⚙️ Seeding default settings...');

  const settings = [
    { key: 'site_name', value: 'Beauty 2026', description: 'Site name' },
    { key: 'site_description', value: "Sri Lanka's Premier Island-wide Beauty Contest", description: 'Site description' },
    { key: 'contact_email', value: 'info@star.tuko.lk', description: 'Contact email' },
    { key: 'voting_enabled', value: true, description: 'Global voting toggle' },
    { key: 'registration_open', value: true, description: 'Registration toggle' },
    { key: 'max_votes_per_user', value: 1, description: 'Max votes per user per contestant per round' },
    { key: 'min_age', value: 18, description: 'Minimum contestant age' },
    { key: 'max_age', value: 28, description: 'Maximum contestant age' },
    { key: 'max_photos', value: 5, description: 'Maximum photos per contestant' },
    { key: 'require_tuko_auth', value: true, description: 'Require Tuko authentication for voting' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: {
        key: setting.key,
        value: setting.value,
        description: setting.description,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
