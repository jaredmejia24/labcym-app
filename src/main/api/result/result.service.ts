import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import { z } from 'zod';
import { findPatientOrThrow } from '../patient/patient.service';
import prisma from './../../database/prisma';
import { createResultSchema, getExamResultsPaginationSchema } from './result.schemas';

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

export async function getExamResultsPagination(
  queries: z.infer<typeof getExamResultsPaginationSchema>
) {
  const [examResult, count] = await Promise.all([
    getResult(queries),
    getCountExamResultByExam(queries.examId)
  ]);

  return { examResult, count };
}

async function getResult(queries: z.infer<typeof getExamResultsPaginationSchema>) {
  if (queries.resultId) {
    const examResult = await prisma.examResult.findFirst({
      where: {
        deletedAt: null,
        examId: queries.examId,
        resultId: queries.resultId
      },
      include: {
        result: {
          include: {
            patient: true
          }
        }
      }
    });

    if (!examResult) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Resultado Examen no encontrado'
      });
    }

    return examResult;
  }

  if (queries.page) {
    const [result] = await prisma.examResult.findMany({
      include: {
        result: {
          include: {
            patient: true
          }
        }
      },
      take: 1,
      skip: queries.page - 1,
      where: { deletedAt: null, examId: queries.examId }
    });

    return result;
  }

  const result = await prisma.examResult.findFirst({
    include: {
      result: {
        include: {
          patient: true
        }
      }
    },
    where: {
      deletedAt: null,
      examId: queries.examId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!result) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Resultado no encontrado'
    });
  }

  return result;
}

function getCountExamResultByExam(examId: number) {
  return prisma.examResult.count({
    where: {
      deletedAt: null,
      examId
    }
  });
}

// todo obtain patient from result
// todo obtain examResult from
