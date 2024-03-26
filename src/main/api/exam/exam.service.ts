import { z } from 'zod';
import prisma from '../../database/prisma';
import { getExamByIdSchema } from './exam.schemas';
import { TRPCError } from '@trpc/server';

export async function getAllExams() {
  return prisma.exam.findMany();
}

export type ReturnGetExamById = ReturnType<typeof getExamById>;
export async function getExamById(queries: z.infer<typeof getExamByIdSchema>) {
  let idPatient: number;

  if (queries.idPatient) {
    idPatient = queries.idPatient;
  } else {
    const result = await prisma.patient.findFirstOrThrow({
      orderBy: {
        createdAt: 'desc'
      }
    });

    idPatient = result.id;
  }

  const exam = await prisma.exam.findFirst({
    where: {
      id: queries.idExam,
      deletedAt: null
    },
    include: {
      examDivision: {
        include: {
          qualitativeProperty: {
            include: {
              qualitativePropertyOption: {
                include: {
                  propertyOption: true
                }
              },
              qualitativePropertyResult: {
                where: {
                  examResult: {
                    result: {
                      patientId: idPatient,
                      deletedAt: null
                    }
                  }
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
              },
              quantitativePropertyResult: {
                where: {
                  examResult: {
                    result: {
                      patientId: idPatient,
                      deletedAt: null
                    }
                  }
                }
              }
            },
            where: { deletedAt: null }
          }
        },
        where: { deletedAt: null }
      }
    }
  });

  if (!exam) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Exam not found' });
  }

  return exam;
}
