import { z } from 'zod';

export const createResultSchema = z.object({
  patientId: z
    .number({ required_error: 'Paciente es requerido' })
    .int()
    .min(1, 'Paciente es requerido'),
  invoiceNumber: z.string().min(1, 'Numero de factura es requerido')
});

export const getResultByIdOrLastSchema = z.object({
  resultId: z.number().int().min(1).optional()
});
