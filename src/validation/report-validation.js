import Joi from "joi";

const createReportValidation = Joi.object({
  fileName: Joi.string().messages({
    "string.empty": "File Name tidak boleh kosong 2",
  }),
  date: Joi.string().messages({
    "string.empty": "Tanggal tidak boleh kosong",
  }),
});
const getExcelValidation = Joi.object({
  search: Joi.string().optional().allow(""),
  page: Joi.number().integer(),
  pageSize: Joi.number().integer(),
});

export { getExcelValidation, createReportValidation };
