import prisma from '../../src/main/database/prisma';

export async function valueReferenceSedders() {
  const [fumadores, mujeres15A20] = await Promise.all([
    prisma.valueReferenceType.upsert({
      where: {
        name: 'Fumadores'
      },
      create: {
        name: 'Fumadores'
      },
      update: {}
    }),
    prisma.valueReferenceType.upsert({
      where: {
        name: 'Mujeres entre 15 - 20 años'
      },
      create: {
        name: 'Mujeres entre 15 - 20 años'
      },
      update: {}
    })
  ]);

  return { fumadores, mujeres15A20 };
}
