import { publicProcedure, router } from './../../lib/trpc';
import { createPatientSchema, getAllPatientsSchema, updatePatientSchema } from './patient.schemas';
import { createPatient, getAllPatients, updatePatient } from './patient.service';

export const patientRouter = router({
  getAll: publicProcedure.input(getAllPatientsSchema).query(async (opts) => {
    return getAllPatients(opts.input);
  }),
  create: publicProcedure.input(createPatientSchema).mutation(async (opts) => {
    return createPatient(opts.input);
  }),
  update: publicProcedure.input(updatePatientSchema).mutation((opts) => {
    return updatePatient(opts.input);
  })
});

export type PatientRouter = typeof patientRouter;
