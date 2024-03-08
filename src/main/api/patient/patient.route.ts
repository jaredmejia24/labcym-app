import { publicProcedure, router } from './../../lib/trpc';
import {
  createPatientSchema,
  getAllPatientsSchema,
  getOnePatientByResultSchema
} from './patient.schemas';
import { createPatient, getAllPatients, getOnePatientByResult } from './patient.service';

export const patientRouter = router({
  getAll: publicProcedure.input(getAllPatientsSchema).query(async (opts) => {
    return getAllPatients(opts.input);
  }),
  getOneByResult: publicProcedure.input(getOnePatientByResultSchema).query(async (opts) => {
    return getOnePatientByResult(opts.input.idResult);
  }),
  create: publicProcedure.input(createPatientSchema).mutation(async (opts) => {
    return createPatient(opts.input);
  })
});

export type PatientRouter = typeof patientRouter;
