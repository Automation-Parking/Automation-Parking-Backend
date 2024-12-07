import reportService from "../service/report-service.js";

const generateReport = async (req, res, next) => {
  if (req.method === "POST") {
    try {
      const params = {
        fileName: req.body.fileName,
        date: req.body.date,
      };
      await reportService.createReport(params);
      return res.redirect("http://localhost:5173/ReportPaper/Report-Paper");
    } catch (error) {
      return next(error);
    }
  } else if (req.method === "GET") {
    try {
      const params = {
        search: req.query.search || "",
        page: req.query.page ? parseInt(req.query.page) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 8,
      };
      const data = await reportService.getExcel(params);
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
