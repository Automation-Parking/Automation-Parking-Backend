import Joi from "joi";

const createReportValidation = Joi.object({
  fileName: Joi.string().required().messages({
    "any.required": "File Name tidak boleh kosong",
    "string.empty": "File Name tidak boleh kosong",
  }),
  date: Joi.string().required().messages({
    "any.required": "Tanggal tidak boleh kosong",
    "string.empty": "Tanggal tidak boleh kosong",
  }),
});
const getExcelValidation = Joi.object({
  search: Joi.string().optional().allow(""),
  page: Joi.number().integer(),
  pageSize: Joi.number().integer(),
});

export { getExcelValidation, createReportValidation };
