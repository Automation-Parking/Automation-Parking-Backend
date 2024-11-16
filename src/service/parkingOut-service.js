import prisma from "../application/database.js";
import { parkingOutValidation } from "../validation/parkingOut-validation.js";

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
  } = params;

  const nextMonth = parseInt(bulan) === 12 ? 1 : parseInt(bulan) + 1;
  const nextYear =
    parseInt(bulan) === 12 ? parseInt(tahun) + 1 : parseInt(tahun);
  try {
    const where = {
      AND: [
        search
          ? {
              OR: [
                { platNomor: { contains: search, mode: "insensitive" } },
                { wilayah: { contains: search, mode: "insensitive" } },
                { kota_provinsi: { contains: search, mode: "insensitive" } },
                { jenisKendaraan: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        bulan
          ? {
              waktuKeluar: {
                gte: new Date(`${tahun}-${bulan}-01`),
                lt: new Date(`${nextYear}-${nextMonth}-01`),
              },
            }
          : {},
        tahun
          ? {
              waktuKeluar: {
                gte: new Date(`${tahun}-01-01`),
                lt: new Date(`${nextYear}-01-01`),
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
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { waktuKeluar: "desc" },
    });

    return { data, total };
  } catch (error) {
    throw new Error("Error fetching parking data");
  }
};

export default {
  getParkingData,
};
