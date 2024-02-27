import prisma from './../../src/main/database/prisma';
import { optionSeeders } from './options.seed';
import { patientSeed } from './patient.seed';
import { valueReferenceSedders } from './value-reference.seed';

async function main() {
  console.log('seeding database...');

  const [{ negativo, positivo, indefinido }, { fumadores, mujeres15A20 }] = await Promise.all([
    optionSeeders(),
    valueReferenceSedders(),
    patientSeed()
  ]);

  await prisma.exam.upsert({
    where: { name: 'Quimica' },
    update: {},
    create: {
      name: 'Quimica',
      examDivision: {
        create: {
          name: 'Division 1',
          qualitativeProperty: {
            create: {
              name: 'cualitativo',
              qualitativePropertyOption: {
                createMany: {
                  skipDuplicates: true,
                  data: [{ propertyOptionId: positivo.id }, { propertyOptionId: negativo.id }]
                }
              }
            }
          },
          quantitativeProperty: {
            create: {
              name: 'eritrocitos',
              unity: 'µm',
              valueReferenceTypeQuantitativeProperty: {
                createMany: {
                  skipDuplicates: true,
                  data: [
                    { valueReferenceTypeId: fumadores.id, value: '1 - 10' },
                    { valueReferenceTypeId: mujeres15A20.id, value: '20 - 30' }
                  ]
                }
              }
            }
          }
        }
      }
    }
  });

  await prisma.exam.upsert({
    where: { name: 'Inmunologia' },
    update: {},
    create: {
      name: 'Inmunologia',
      examDivision: {
        create: {
          name: 'Division 1',
          qualitativeProperty: {
            create: {
              name: 'covid',
              qualitativePropertyOption: {
                createMany: {
                  skipDuplicates: true,
                  data: [{ propertyOptionId: positivo.id }, { propertyOptionId: indefinido.id }]
                }
              }
            }
          },
          quantitativeProperty: {
            create: {
              name: 'linfocitos',
              unity: 'µm',
              valueReferenceTypeQuantitativeProperty: {
                createMany: {
                  skipDuplicates: true,
                  data: [{ valueReferenceTypeId: fumadores.id, value: '1 - 10' }]
                }
              }
            }
          }
        }
      }
    }
  });
}

main()
  .then(() => console.log('database has been seed'))
  .finally(async () => {
    await prisma.$disconnect();
  });
