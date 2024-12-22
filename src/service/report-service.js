import prisma from "../application/database.js";
import axios from "axios";
import {
  getExcelValidation,
  createReportValidation,
} from "../validation/report-validation.js";

const getReport = async (date) => {
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

const getExcel = async (data) => {
  const { error } = getExcelValidation.validate(data);
  if (error) throw new Error(error.details[0].message);
  const { search, page, pageSize } = data;
  try {
    const where = search
      ? { fileName: { contains: search, mode: "insensitive" } }
      : {};

    // Hitung total data
    const total = await prisma.data_excel.count({ where });

    // Ambil data dengan paginasi
    const data = await prisma.data_excel.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data, total };
  } catch (error) {
    throw new Error("Error fetching parking data");
  }
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
  const Data = parkingData.map((item) => ({
    "Plat Nomor": item.platNomor,
    "Jenis Kendaraan": item.jenisKendaraan,
    "Wilayah": item.wilayah,
    "Kota Provinsi": item.kota_provinsi,
    "Jam Masuk": item.waktuMasuk,
    "Jam Keluar": item.waktuKeluar,
    "Total Jam": item.totalTime,
    "Tagihan": item.payment.totalPrice,
    "Kode Transaksi": item.payment.transactionId,
    "Status Transaksi": item.payment.status,
  }));
  console.log(`Data: ${Data}`);
  console.log(`File name: ${fileName}`);
  // Kirim data ke API Python
  const response = await axios.post("https://braincore-parking-v1-49333590966.asia-southeast2.run.app/datarecap",
    {
      filename: fileName,
      data: JSON.stringify(Data),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    });
  console.log(response);
  const fileLink = response.data.data.file_link;
  // Simpan hasil ke tabel `data_excel`
  await prisma.data_excel.create({
    data: {
      fileName: fileName,
      excelLink: fileLink,
    },
  });
};

export default { createReport, getExcel };
