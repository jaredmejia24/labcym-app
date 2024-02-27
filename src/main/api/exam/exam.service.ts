import { z } from 'zod';
import prisma from '../../database/prisma';
import { getExamByIdSchema } from './exam.schemas';
import { TRPCError } from '@trpc/server';

export async function getAllExams() {
  return prisma.exam.findMany();
}

export type ReturnGetExamById = ReturnType<typeof getExamById>;
export async function getExamById(queries: z.infer<typeof getExamByIdSchema>) {
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
  });

  if (!exam) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Exam not found' });
  }

  return exam;
}
