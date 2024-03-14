import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import prisma from '../../database/prisma';
import { createPatientSchema, getAllPatientsSchema, updatePatientSchema } from './patient.schemas';

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
  if (body.identification) {
    await findPatientIdentifierConflict(body.identification);
  }

  return prisma.patient.create({
    data: {
      birthDate: body.birthDate,
      name: body.name,
      identification: body.identification || undefined
    }
  });
}

export async function updatePatient(body: z.infer<typeof updatePatientSchema>) {
  const patient = await findPatientOrThrow(body.idPatient);

  if (body.identification && body.identification !== patient.identification) {
    await findPatientIdentifierConflict(body.identification);
  }

  const { idPatient, ...payload } = body;

  return prisma.patient.update({
    where: {
      id: body.idPatient
    },
    data: payload
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
      message: 'Paciente ya existe con esta identificacion'
    });
  }

  return true as const;
}

export async function findPatientOrThrow(idPatient: number) {
  const patient = await prisma.patient.findFirst({
    where: {
      id: idPatient,
      deletedAt: null
    }
  });

  if (!patient) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Paciente no existe'
    });
  }

  return patient;
}
