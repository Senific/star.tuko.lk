import prisma from '@/lib/prisma';

// Get all provinces
export async function getProvinces() {
  return prisma.province.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { districts: true, contestants: true },
      },
    },
  });
}

// Get province by ID
export async function getProvinceById(id: string) {
  return prisma.province.findUnique({
    where: { id },
    include: {
      districts: {
        orderBy: { sortOrder: 'asc' },
      },
      _count: {
        select: { contestants: true },
      },
    },
  });
}

// Get all districts
export async function getDistricts(provinceId?: string) {
  return prisma.district.findMany({
    where: provinceId ? { provinceId } : undefined,
    orderBy: { sortOrder: 'asc' },
    include: {
      province: true,
      _count: {
        select: { contestants: true },
      },
    },
  });
}

// Get district by ID
export async function getDistrictById(id: string) {
  return prisma.district.findUnique({
    where: { id },
    include: {
      province: true,
      _count: {
        select: { contestants: true },
      },
    },
  });
}

// Get location statistics
export async function getLocationStats() {
  const [provinces, districts, contestantsByProvince, contestantsByDistrict] = await Promise.all([
    prisma.province.count(),
    prisma.district.count(),
    prisma.contestant.groupBy({
      by: ['provinceId'],
      where: { status: 'APPROVED' },
      _count: true,
    }),
    prisma.contestant.groupBy({
      by: ['districtId'],
      where: { status: 'APPROVED' },
      _count: true,
    }),
  ]);

  return {
    totalProvinces: provinces,
    totalDistricts: districts,
    contestantsByProvince: contestantsByProvince.map(p => ({
      provinceId: p.provinceId,
      count: p._count,
    })),
    contestantsByDistrict: contestantsByDistrict.map(d => ({
      districtId: d.districtId,
      count: d._count,
    })),
  };
}
