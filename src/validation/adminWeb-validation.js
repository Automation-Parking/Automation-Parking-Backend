import Joi from "joi";

const parkingOutValidation = Joi.object({
  search: Joi.string().optional().allow(""),
  bulan: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .optional()
    .messages({
      "number.base": "Bulan harus berupa angka",
      "number.min": "Bulan tidak boleh kurang dari 1",
      "number.max": "Bulan tidak boleh lebih dari 12",
    })
    .allow(null),
  tahun: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      "number.base": "Tahun harus berupa angka",
      "number.min": "Tahun tidak boleh kurang dari 1900",
      "number.max": `Tahun tidak boleh lebih dari ${new Date().getFullYear()}`,
    })
    .allow(null),
  wilayah: Joi.string().optional().allow(""),
  kotaProvinsi: Joi.string().optional().allow(""),
  jenisKendaraan: Joi.string().optional().allow(""),
  page: Joi.number().integer(),
  pageSize: Joi.number().integer(),
});

export { parkingOutValidation };
