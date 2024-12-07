import prisma from "../application/database.js";
import { parkingOutValidation } from "../validation/adminWeb-validation.js";

const getParkingData = async (params) => {
  const { error } = parkingOutValidation.validate(params);
  if (error) throw new Error(error.details[0].message);

  const {
    search,
    bulan,
    tahun,
    wilayah,
    kotaProvinsi,
    jenisKendaraan,
    page,
    pageSize,
    orderBy,
  } = params;

  let nextMonth = null;
  let nextYear = null;
  if (bulan && tahun && !isNaN(parseInt(bulan)) && !isNaN(parseInt(tahun))) {
    nextMonth = parseInt(bulan) === 12 ? 1 : parseInt(bulan) + 1;
    nextYear = parseInt(bulan) === 12 ? parseInt(tahun) + 1 : parseInt(tahun);
  }
  let urut = "asc";
  if (orderBy == "waktu_Keluar") {
    urut = "desc";
  }
  try {
    const where = {
      AND: [
        search
          ? {
              OR: [
                { platNomor: { contains: search } },
                { wilayah: { contains: search } },
                { kota_provinsi: { contains: search } },
                { jenisKendaraan: { contains: search } },
              ],
            }
          : {},
        bulan && tahun && nextMonth !== null && nextYear !== null
          ? {
              waktuKeluar: {
                gte: new Date(`${tahun}-${bulan}-01`),
                lt: new Date(`${nextYear}-${nextMonth}-01`),
              },
            }
          : {},
        wilayah ? { wilayah: { contains: wilayah, mode: "insensitive" } } : {},
        kotaProvinsi
          ? { kota_provinsi: { contains: kotaProvinsi, mode: "insensitive" } }
          : {},
        jenisKendaraan
          ? {
              jenisKendaraan: { contains: jenisKendaraan, mode: "insensitive" },
            }
          : {},
      ],
    };
    // Hitung total data
    const total = await prisma.parking_out.count({ where });

    // Ambil data dengan paginasi
    const data = await prisma.parking_out.findMany({
      where, // kondisi pencarian
      skip:
        pageSize !== "all" && page
          ? (page - 1) * parseInt(pageSize)
          : undefined, // jika pageSize "all", tidak ada skip
      take: pageSize !== "all" ? parseInt(pageSize) : undefined, // jika pageSize "all", tidak ada limit
      orderBy: { [orderBy]: urut }, // urutkan berdasarkan waktu keluar
      include: {
        payment: true,
      },
    });

    return { data, total };
  } catch (error) {
    throw new Error("Error fetching parking data");
  }
};
const getParkingDataByRegion = async () => {
  try {
    // Mengelompokkan berdasarkan wilayah dan menghitung jumlah
    const data = await prisma.parking_out.groupBy({
      by: ["wilayah"],
      _count: {
        id: true, // Menghitung jumlah entri berdasarkan id
      },
    });

    // Mengirimkan hasil ke client
    return data;
  } catch (error) {
    throw new Error("Error fetching parking data by Region");
  }
};
const getParkingDataByCity = async () => {
  try {
    // Mengelompokkan berdasarkan wilayah dan menghitung jumlah
    const data = await prisma.parking_out.groupBy({
      by: ["kota_provinsi"],
      _count: {
        id: true, // Menghitung jumlah entri berdasarkan id
      },
    });
    // Mengirimkan hasil ke client
    return data;
  } catch (error) {
    throw new Error("Error fetching parking data by City");
  }
};

const getParkingDataByMonth = async (params) => {
  try {
    const { tahun } = params;

    // Query menggunakan groupBy Prisma
    const results = await prisma.parking_out.groupBy({
      by: ["waktuMasuk"],
      where: {
        waktuMasuk: {
          gte: new Date(`${tahun}-01-01`), // Awal tahun
          lt: new Date(`${parseInt(tahun) + 1}-01-01`), // Akhir tahun
        },
      },
      _count: {
        _all: true,
      },
    });

    // Map hasil untuk mengelompokkan berdasarkan bulan
    const visitsByMonth = Array(12).fill(0); // Array untuk 12 bulan
    results.forEach((result) => {
      const month = new Date(result.waktuMasuk).getMonth(); // Bulan 0-11
      visitsByMonth[month] += result._count._all;
    });

    // Format hasil untuk dikembalikan
    const formattedResults = visitsByMonth.map((count, index) => ({
      month: index + 1, // Bulan 1-12
      totalVisits: count,
    }));

    return formattedResults;
  } catch (error) {
    throw new Error("Error fetching parking data by Mont");
  }
};

const getWeekInMonth = (date) => {
  const dayOfMonth = date.getDate(); // Hari dalam bulan

  // Tentukan minggu berdasarkan rentang tanggal
  if (dayOfMonth >= 1 && dayOfMonth <= 7) return 1; // Minggu 1: 1-7
  if (dayOfMonth >= 8 && dayOfMonth <= 14) return 2; // Minggu 2: 8-14
  if (dayOfMonth >= 15 && dayOfMonth <= 21) return 3; // Minggu 3: 15-21
  return 4; // Minggu 4: 22 sampai akhir bulan
};

const getParkingDataByWeekInMonth = async (params) => {
  try {
    const { tahun } = params;

    // Query semua data kunjungan untuk tahun tertentu
    const results = await prisma.parking_out.findMany({
      where: {
        waktuMasuk: {
          gte: new Date(`${tahun}-01-01`), // Awal tahun
          lt: new Date(`${parseInt(tahun) + 1}-01-01`), // Awal tahun berikutnya
        },
      },
      select: {
        waktuMasuk: true, // Ambil hanya tanggal waktuMasuk
      },
    });

    // Struktur default untuk semua bulan dan minggu
    const defaultStructure = {};
    for (let month = 1; month <= 12; month++) {
      defaultStructure[month] = {};
      for (let week = 1; week <= 4; week++) {
        defaultStructure[month][week] = 0; // Default 0
      }
    }

    // Map data hasil query ke dalam struktur default
    results.forEach((result) => {
      const date = new Date(result.waktuMasuk);
      const month = date.getMonth() + 1; // Bulan 1-12
      const week = getWeekInMonth(date); // Hitung minggu keberapa dalam bulan

      // Tambahkan ke struktur default
      if (
        defaultStructure[month] &&
        defaultStructure[month][week] !== undefined
      ) {
        defaultStructure[month][week]++;
      }
    });

    // Format hasil untuk output
    const formattedResults = Object.entries(defaultStructure).map(
      ([month, weeks]) => ({
        month: parseInt(month),
        weeks: Object.entries(weeks).map(([week, totalVisits]) => ({
          week: parseInt(week),
          totalVisits,
        })),
      })
    );

    return formattedResults;
  } catch (error) {
    throw new Error("Error fetching parking data by Week in Month");
  }
};

export default {
  getParkingData,
  getParkingDataByCity,
  getParkingDataByRegion,
  getParkingDataByMonth,
  getParkingDataByWeekInMonth,
};
