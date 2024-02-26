import prisma from './../../src/main/database/prisma';
import { optionSeeders } from './options.seed';
import { valueReferenceSedders } from './value-reference.seed';

async function main() {
  console.log('seeding database...');

  const [{ negativo, positivo, indefinido }, { fumadores, mujeres15A20 }] = await Promise.all([
    optionSeeders(),
    valueReferenceSedders()
  ]);

  await prisma.exam.upsert({
    where: { name: 'Quimica' },
    update: {},
    create: {
      name: 'Quimica',
      ExamDivision: {
        create: {
          name: 'Division 1',
          QualitativeProperty: {
            create: {
              name: 'cualitativo',
              QualitativePropertyOption: {
                createMany: {
                  skipDuplicates: true,
                  data: [{ propertyOptionId: positivo.id }, { propertyOptionId: negativo.id }]
                }
              }
            }
          },
          QuantitativeProperty: {
            create: {
              name: 'eritrocitos',
              unity: 'µm',
              ValueReferenceTypeQuantitativeProperty: {
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
      ExamDivision: {
        create: {
          name: 'Division 1',
          QualitativeProperty: {
            create: {
              name: 'covid',
              QualitativePropertyOption: {
                createMany: {
                  skipDuplicates: true,
                  data: [{ propertyOptionId: positivo.id }, { propertyOptionId: indefinido.id }]
                }
              }
            }
          },
          QuantitativeProperty: {
            create: {
              name: 'linfocitos',
              unity: 'µm',
              ValueReferenceTypeQuantitativeProperty: {
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
