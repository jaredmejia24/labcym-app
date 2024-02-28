import { z } from 'zod';
import { createPatientSchema, getAllPatientsSchema } from './patient.schemas';
import prisma from '../../database/prisma';
import { TRPCError } from '@trpc/server';

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

export async function createPatient(body: z.infer<typeof createPatientSchema>) {
  if (body.identificacion) {
    await findPatientIdentifierConflict(body.identificacion);
  }

  return prisma.patient.create({
    data: {
      birthDate: body.birthDate,
      name: body.name,
      identification: body.identificacion
    }
  });
}

export async function findPatientIdentifierConflict(identifier: string) {
  const patient = await prisma.patient.findFirst({
    where: {
      identification: identifier,
      deletedAt: null
    }
  });

  if (patient) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Paciente ya existe con este id'
    });
  }

  return true as const;
}
