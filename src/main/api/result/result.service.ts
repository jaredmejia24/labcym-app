import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import { z } from 'zod';
import { findPatientOrThrow } from '../patient/patient.service';
import prisma from './../../database/prisma';
import { createResultSchema } from './result.schemas';

export async function createResult(body: z.infer<typeof createResultSchema>) {
  await findPatientOrThrow(body.patientId);

  const invoice = await prisma.invoice.findFirst({
    where: {
      number: body.invoiceNumber
    }
  });

  if (invoice) {
    const currentDay = dayjs().format('YYYY-MM-DD');

    const results = await prisma.result.count({
      where: {
        invoiceId: invoice.id,
        patientId: body.patientId,
        createdAt: { gte: dayjs(currentDay, 'YYYY-MM-DD').toDate() }
      }
    });

    if (!results) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Factura le pertenece a otro paciente'
      });
    }
  }

  return prisma.$transaction(async (tx) => {
    let invoiceId: number;
    if (!invoice) {
      const newInvoice = await tx.invoice.create({ data: { number: body.invoiceNumber } });

      invoiceId = newInvoice.id;
    } else {
      invoiceId = invoice.id;
    }

    return tx.result.create({ data: { invoiceId: invoiceId, patientId: body.patientId } });
  });
}

export async function getResultByIdOrLast(resultId: number | undefined) {
  let result: Prisma.ResultGetPayload<{ include: { patient: true } }> | null;

  if (resultId) {
    result = await prisma.result.findFirst({
      include: {
        patient: true
      },
      where: {
        deletedAt: null,
        id: resultId
      }
    });
  } else {
    result = await prisma.result.findFirst({
      include: {
        patient: true
      },
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  if (!result) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Resultado no encontrado'
    });
  }

  return result;
}
