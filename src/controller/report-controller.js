import reportService from "../service/report-service.js";

const generateReport = async (req, res, next) => {
  if (req.method === "POST") {
    try {
      await reportService.createReport(req.body);
      return res.status(200).json({
        message: "Report berhasil dibuat",
      });
    } catch (error) {
      return next(error);
    }
  } else if (req.method === "GET") {
    try {
      const data = await reportService.getReport(req.query);
      return res.status(200).json({
        message: "Report berhasil diambil",
        data,
      });
    } catch (error) {
      return next(error);
    }
  } else {
    return res.status(405).json({ error: "Method tidak diizinkan" });
  }
};

export default { generateReport };
