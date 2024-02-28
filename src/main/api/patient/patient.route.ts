import { publicProcedure, router } from './../../lib/trpc';
import { createPatientSchema, getAllPatientsSchema } from './patient.schemas';
import { createPatient, getAllPatients } from './patient.service';

export const patientRouter = router({
  getAll: publicProcedure.input(getAllPatientsSchema).query(async (opts) => {
    return getAllPatients(opts.input);
  }),
  create: publicProcedure.input(createPatientSchema).mutation(async (opts) => {
    return createPatient(opts.input);
  })
});

export type PatientRouter = typeof patientRouter;
