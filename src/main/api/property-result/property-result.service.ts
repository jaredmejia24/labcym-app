import prisma from './../../database/prisma';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { updateOrCreatePropertyResultSchema } from './property-result.schemas';

export async function updateOrCreateResultProperty(
  body: z.infer<typeof updateOrCreatePropertyResultSchema>
) {
  const examResult = await prisma.examResult.findFirst({
    where: {
      deletedAt: null,
      id: body.examResultId
    }
  });

  if (!examResult) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No existe el resultado del examen'
    });
  }

  if (body.type === 'quantitative') {
    return prisma.quantitativePropertyResult.upsert({
      where: {
        quantitativePropertyId_examResultId: {
          examResultId: examResult.id,
          quantitativePropertyId: body.quantitativePropertyId
        }
      },
      create: {
        result: body.value,
        examResultId: examResult.id,
        quantitativePropertyId: body.quantitativePropertyId
      },
      update: {
        result: body.value
      }
    });
  }

  if (body.propertyOptionId) {
    const propertyOption = await prisma.propertyOption.findFirst({
      where: {
        deletedAt: null,
        id: body.propertyOptionId
      }
    });

    if (!propertyOption) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No existe la property option'
      });
    }
  }

  return prisma.qualitativePropertyResult.upsert({
    where: {
      qualitativePropertyId_examResultId: {
        examResultId: examResult.id,
        qualitativePropertyId: body.qualitativePropertyId
      }
    },
    create: {
      examResultId: examResult.id,
      qualitativePropertyId: body.qualitativePropertyId,
      result: body.result,
      propertyOptionId: body.propertyOptionId
    },
    update: {
      result: body.result,
      propertyOptionId: body.propertyOptionId
    }
  });
}
