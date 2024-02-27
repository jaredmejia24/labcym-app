import prisma from '../../src/main/database/prisma';
import * as dayjs from 'dayjs';

export async function patientSeed() {
  await prisma.patient.upsert({
    where: {
      identification: '0801200406344'
    },
    update: {
      birthDate: dayjs('2004-03-24', 'YYYY-MM-DD').toDate(),
      name: 'Jared Mejia'
    },
    create: {
      birthDate: dayjs('2004-03-24', 'YYYY-MM-DD').toDate(),
      name: 'Jared Mejia',
      identification: '0801200406344'
    }
  });
}
