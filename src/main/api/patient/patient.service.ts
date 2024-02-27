import { z } from 'zod';
import { getAllPatientsSchema } from './patient.schemas';
import prisma from '../../database/prisma';

export async function getAllPatients(queries: z.infer<typeof getAllPatientsSchema>) {
  const patients = await prisma.patient.findMany({
    where: {
      ...(queries.search
        ? {
            OR: [
              { identification: { contains: queries.search, mode: 'insensitive' } },
              { name: { contains: queries.search, mode: 'insensitive' } }
            ]
          }
        : {}),
      deletedAt: null
    },
    take: 200
  });

  return patients;
}
