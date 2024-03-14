import { formatDate } from './../../lib/validation';
import { z } from 'zod';

export const getAllPatientsSchema = z.object({
  search: z.string().min(1).default('').optional()
});

export const createPatientSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  identification: z.string().optional(),
  birthDate: formatDate('YYYY-MM-DD')
});

export const updatePatientSchema = createPatientSchema.partial().extend({
  idPatient: z.number().int().min(1)
});
