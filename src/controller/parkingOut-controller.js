import parkingOutService from "../service/parkingOut-service.js";

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
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10,
    };

    // Memanggil service untuk mendapatkan data
    const { data, total } = await parkingOutService.getParkingData(params);

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

export default {
  getParkingOutData,
};
