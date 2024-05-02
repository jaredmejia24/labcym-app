import prisma from '../../database/prisma';

export async function getAllExams() {
  return prisma.exam.findMany();
}
