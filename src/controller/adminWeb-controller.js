import adminWebService from "../service/adminWeb-service.js";

// Controller untuk menangani request GET /customers
const getParkingOutData = async (req, res, next) => {
  try {
    const params = {
      search: req.query.search || "",
      bulan: req.query.bulan ? parseInt(req.query.bulan) : null,
      tahun: req.query.tahun ? parseInt(req.query.tahun) : null,
      wilayah: req.query.wilayah || "",
      kotaProvinsi: req.query.kota_provinsi || "",
      jenisKendaraan: req.query.jenisKendaraan || "",
      page: req.query.page ? parseInt(req.query.page) : 1,
      pageSize:
        req.query.pageSize === "all"
          ? "all"
          : req.query.pageSize
          ? parseInt(req.query.pageSize)
          : 15,
      orderBy: req.query.orderBy || "waktuKeluar",
    };

    // Memanggil service untuk mendapatkan data
    const { data, total } = await adminWebService.getParkingData(params);

    // Mengirimkan respons
    return res.status(200).json({
      success: true,
      message: "Success",
      total,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getParkingByCity = async (req, res, next) => {
  try {
    const data = await adminWebService.getParkingDataByCity();
    return res.status(200).json({
      success: true,
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getParkingByRegion = async (req, res, next) => {
  try {
    const data = await adminWebService.getParkingDataByRegion();
    return res.status(200).json({
      success: true,
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
const getParkingByMonth = async (req, res, next) => {
  try {
    const params = {
      tahun: req.query.tahun
        ? parseInt(req.query.tahun)
        : new Date().getFullYear(),
    };
    const data = await adminWebService.getParkingDataByMonth(params);
    return res.status(200).json({
      success: true,
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
const getParkingByWeekInMonth = async (req, res, next) => {
  try {
    const params = {
      tahun: req.query.tahun
        ? parseInt(req.query.tahun)
        : new Date().getFullYear(),
    };
    const data = await adminWebService.getParkingDataByWeekInMonth(params);
    return res.status(200).json({
      success: true,
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getParkingOutData,
  getParkingByCity,
  getParkingByRegion,
  getParkingByRegion,
  getParkingByMonth,
  getParkingByWeekInMonth,
};
