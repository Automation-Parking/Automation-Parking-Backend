// src/validation/parking-validation.js
import Joi from 'joi';

const parkInValidation = Joi.object({
  platNomor: Joi.string().optional(),
  wilayah: Joi.string().optional(),
  kota_provinsi: Joi.string().optional(),
  jenis_kendaraan: Joi.string().optional(),
  image_link: Joi.string().uri().optional(),
});

const parkOutValidation = Joi.object({
  platNomor: Joi.string().optional(),
  wilayah: Joi.string().optional(),
  kota_provinsi: Joi.string().optional(),
  jenis_kendaraan: Joi.string().optional(),
  image_link: Joi.string().uri().optional(),
});

export { parkInValidation, parkOutValidation };