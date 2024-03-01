// import prisma from '@main/database/prisma';
// import dayjs from 'dayjs';

// export async function findActiveInvooiceOrThrow(invoiceNumber: string) {
//   const currentDay = dayjs().format('YYYY-MM-DD');

//   const invoice = await prisma.invoice.findFirst({
//     where: {
//       number: invoiceNumber,
//       createdAt: {
//         lt: dayjs(currentDay, 'YYYY-MM-DD').toDate()
//       }
//     }
//   });

  
// }
