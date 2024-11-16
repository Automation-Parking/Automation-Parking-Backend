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
const getReportValidation = Joi.object({
  date: Joi.string().required().messages({
    "any.required": "Tanggal tidak boleh kosong",
    "string.empty": "Tanggal tidak boleh kosong",
  }),
});

export { getReportValidation, createReportValidation };
