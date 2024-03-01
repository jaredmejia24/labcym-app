import { z } from 'zod';
import { createResultSchema } from './result.schemas';
import prisma from './../../database/prisma';
import { findPatientOrThrow } from '../patient/patient.service';
import dayjs from 'dayjs';
import { TRPCError } from '@trpc/server';

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
