import prisma from '../../src/main/database/prisma';

export async function optionSeeders() {
  const [positivo, negativo, indefinido] = await Promise.all([
    prisma.propertyOption.upsert({
      create: {
        name: 'Positivo'
      },
      where: {
        name: 'Positivo'
      },
      update: {}
    }),
    prisma.propertyOption.upsert({
      create: {
        name: 'Negativo'
      },
      where: {
        name: 'Negativo'
      },
      update: {}
    }),
    prisma.propertyOption.upsert({
      create: {
        name: 'Indefinido'
      },
      where: {
        name: 'Indefinido'
      },
      update: {}
    })
  ]);

  return { positivo, negativo, indefinido };
}
