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
  const count = await getCountExamResultByExam(queries);

  const take = 1;

  const totalPages = Math.ceil(count / take);

  const skip = ((queries.page || totalPages) - 1) * take || 0;

  const examResult = await prisma.examResult.findMany({
    take,
    skip,
    include: {
      result: {
        include: {
          patient: true
        }
      },
      qualitativePropertyResult: {
        include: {
          propertyOption: true
        }
      },
      quantitativePropertyResult: true,
      exam: {
        include: {
          examDivision: {
            include: {
              qualitativeProperty: {
                include: {
                  qualitativePropertyOption: {
                    include: {
                      propertyOption: true
                    }
                  }
                },
                where: {
                  deletedAt: null
                }
              },
              quantitativeProperty: {
                include: {
                  valueReferenceTypeQuantitativeProperty: {
                    include: { quantitativeProperty: true, valueReferenceType: true }
                  }
                },
                where: { deletedAt: null }
              }
            },
            where: { deletedAt: null }
          }
        }
      }
    },
    where: {
      examId: queries.examId
    }
  });

  return { examResult: examResult[0], totalPages };
}

function getCountExamResultByExam(queries: z.infer<typeof getExamResultsPaginationSchema>) {
  return prisma.examResult.count({
    where: {
      deletedAt: null,
      examId: queries.examId
    }
  });
}
