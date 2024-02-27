import { publicProcedure, router } from './../../lib/trpc';
import { getAllPatientsSchema } from './patient.schemas';
import { getAllPatients } from './patient.service';

export const patientRouter = router({
  getAll: publicProcedure.input(getAllPatientsSchema).query(async (opts) => {
    return getAllPatients(opts.input);
  })
});

export type PatientRouter = typeof patientRouter;
