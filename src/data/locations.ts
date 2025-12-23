// Sri Lanka Districts and Provinces Data

export interface District {
  id: string;
  name: {
    en: string;
    si: string;
    ta: string;
  };
  provinceId: string;
}

export interface Province {
  id: string;
  name: {
    en: string;
    si: string;
    ta: string;
  };
  districts: string[];
}

export const provinces: Province[] = [
  {
    id: 'western',
    name: { en: 'Western Province', si: 'බස්නාහිර පළාත', ta: 'மேல் மாகாணம்' },
    districts: ['colombo', 'gampaha', 'kalutara']
  },
  {
    id: 'central',
    name: { en: 'Central Province', si: 'මධ්‍යම පළාත', ta: 'மத்திய மாகாணம்' },
    districts: ['kandy', 'matale', 'nuwara-eliya']
  },
  {
    id: 'southern',
    name: { en: 'Southern Province', si: 'දකුණු පළාත', ta: 'தென் மாகாணம்' },
    districts: ['galle', 'matara', 'hambantota']
  },
  {
    id: 'northern',
    name: { en: 'Northern Province', si: 'උතුරු පළාත', ta: 'வட மாகாணம்' },
    districts: ['jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu']
  },
  {
    id: 'eastern',
    name: { en: 'Eastern Province', si: 'නැගෙනහිර පළාත', ta: 'கிழக்கு மாகாணம்' },
    districts: ['batticaloa', 'ampara', 'trincomalee']
  },
  {
    id: 'north-western',
    name: { en: 'North Western Province', si: 'වයඹ පළාත', ta: 'வடமேல் மாகாணம்' },
    districts: ['kurunegala', 'puttalam']
  },
  {
    id: 'north-central',
    name: { en: 'North Central Province', si: 'උතුරු මැද පළාත', ta: 'வட மத்திய மாகாணம்' },
    districts: ['anuradhapura', 'polonnaruwa']
  },
  {
    id: 'uva',
    name: { en: 'Uva Province', si: 'ඌව පළාත', ta: 'ஊவா மாகாணம்' },
    districts: ['badulla', 'monaragala']
  },
  {
    id: 'sabaragamuwa',
    name: { en: 'Sabaragamuwa Province', si: 'සබරගමුව පළාත', ta: 'சபரகமுவ மாகாணம்' },
    districts: ['ratnapura', 'kegalle']
  }
];

export const districts: District[] = [
  // Western Province
  { id: 'colombo', name: { en: 'Colombo', si: 'කොළඹ', ta: 'கொழும்பு' }, provinceId: 'western' },
  { id: 'gampaha', name: { en: 'Gampaha', si: 'ගම්පහ', ta: 'கம்பஹா' }, provinceId: 'western' },
  { id: 'kalutara', name: { en: 'Kalutara', si: 'කළුතර', ta: 'களுத்துறை' }, provinceId: 'western' },
  
  // Central Province
  { id: 'kandy', name: { en: 'Kandy', si: 'මහනුවර', ta: 'கண்டி' }, provinceId: 'central' },
  { id: 'matale', name: { en: 'Matale', si: 'මාතලේ', ta: 'மாத்தளை' }, provinceId: 'central' },
  { id: 'nuwara-eliya', name: { en: 'Nuwara Eliya', si: 'නුවරඑළිය', ta: 'நுவரெலியா' }, provinceId: 'central' },
  
  // Southern Province
  { id: 'galle', name: { en: 'Galle', si: 'ගාල්ල', ta: 'காலி' }, provinceId: 'southern' },
  { id: 'matara', name: { en: 'Matara', si: 'මාතර', ta: 'மாத்தறை' }, provinceId: 'southern' },
  { id: 'hambantota', name: { en: 'Hambantota', si: 'හම්බන්තොට', ta: 'அம்பாந்தோட்டை' }, provinceId: 'southern' },
  
  // Northern Province
  { id: 'jaffna', name: { en: 'Jaffna', si: 'යාපනය', ta: 'யாழ்ப்பாணம்' }, provinceId: 'northern' },
  { id: 'kilinochchi', name: { en: 'Kilinochchi', si: 'කිලිනොච්චිය', ta: 'கிளிநொச்சி' }, provinceId: 'northern' },
  { id: 'mannar', name: { en: 'Mannar', si: 'මන්නාරම', ta: 'மன்னார்' }, provinceId: 'northern' },
  { id: 'vavuniya', name: { en: 'Vavuniya', si: 'වවුනියාව', ta: 'வவுனியா' }, provinceId: 'northern' },
  { id: 'mullaitivu', name: { en: 'Mullaitivu', si: 'මුලතිව්', ta: 'முல்லைத்தீவு' }, provinceId: 'northern' },
  
  // Eastern Province
  { id: 'batticaloa', name: { en: 'Batticaloa', si: 'මඩකලපුව', ta: 'மட்டக்களப்பு' }, provinceId: 'eastern' },
  { id: 'ampara', name: { en: 'Ampara', si: 'අම්පාර', ta: 'அம்பாறை' }, provinceId: 'eastern' },
  { id: 'trincomalee', name: { en: 'Trincomalee', si: 'ත්‍රිකුණාමලය', ta: 'திருகோணமலை' }, provinceId: 'eastern' },
  
  // North Western Province
  { id: 'kurunegala', name: { en: 'Kurunegala', si: 'කුරුණෑගල', ta: 'குருநாகல்' }, provinceId: 'north-western' },
  { id: 'puttalam', name: { en: 'Puttalam', si: 'පුත්තලම', ta: 'புத்தளம்' }, provinceId: 'north-western' },
  
  // North Central Province
  { id: 'anuradhapura', name: { en: 'Anuradhapura', si: 'අනුරාධපුරය', ta: 'அனுராதபுரம்' }, provinceId: 'north-central' },
  { id: 'polonnaruwa', name: { en: 'Polonnaruwa', si: 'පොළොන්නරුව', ta: 'பொலன்னறுவை' }, provinceId: 'north-central' },
  
  // Uva Province
  { id: 'badulla', name: { en: 'Badulla', si: 'බදුල්ල', ta: 'பதுளை' }, provinceId: 'uva' },
  { id: 'monaragala', name: { en: 'Monaragala', si: 'මොණරාගල', ta: 'மொணராகலை' }, provinceId: 'uva' },
  
  // Sabaragamuwa Province
  { id: 'ratnapura', name: { en: 'Ratnapura', si: 'රත්නපුර', ta: 'இரத்தினபுரி' }, provinceId: 'sabaragamuwa' },
  { id: 'kegalle', name: { en: 'Kegalle', si: 'කෑගල්ල', ta: 'கேகாலை' }, provinceId: 'sabaragamuwa' }
];

export const getDistrictsByProvince = (provinceId: string): District[] => {
  return districts.filter(d => d.provinceId === provinceId);
};

export const getProvinceByDistrict = (districtId: string): Province | undefined => {
  const district = districts.find(d => d.id === districtId);
  if (!district) return undefined;
  return provinces.find(p => p.id === district.provinceId);
};
