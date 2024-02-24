import prisma from '../../database/prisma';

export async function getExamsService() {
  return prisma.exam.findMany();
}
