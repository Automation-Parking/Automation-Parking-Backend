import prisma from "../application/database.js";
import axios from "axios";
import {
  getReportValidation,
  createReportValidation,
} from "../validation/report-validation.js";

const getReport = async (date) => {
  // Validasi input
  const { error } = getReportValidation.validate(date);
  if (error) throw new Error(error.details[0].message);

  const [year, month] = date["date"].split("-");

  const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
  const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);

  // Ambil data dari tabel `parking_out` yang di-join dengan tabel `payment`
  const parkingData = await prisma.parking_out.findMany({
    where: {
      waktuMasuk: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${nextYear}-${nextMonth}-01`),
      },
    },
    include: {
      payment: true,
    },
  });

  if (parkingData.length === 0) {
    return null;
  }

  return parkingData;
};

const createReport = async (data) => {
  // Validasi input
  const { error } = createReportValidation.validate(data);
  if (error) throw new Error(error.details[0].message);

  const { fileName, date } = data;

  // Ambil data dari tabel `parking_out` yang di-join dengan tabel `payment`
  const parkingData = await getReport({ date });

  if (parkingData === null) {
    throw new Error("Tidak ada data yang ditemukan untuk bulan tersebut");
  }
  // Kirim data ke API Python
  const response = await axios.post("http://localhost:5000/generate-report", {
    fileName,
    data: parkingData,
  });
  const fileLink = response.data.file_link;
  // Simpan hasil ke tabel `data_excel`
  await prisma.data_excel.create({
    data: {
      fileName,
      fileLink,
    },
  });
};

export default { createReport, getReport };
