import { z } from 'zod';
import dayjs from 'dayjs';

export function formatDate(format: string) {
  return z.date({ required_error: 'Fecha es requerida.' }).transform((value, ctx) => {
    const date = dayjs(value, format, true);

    if (!date.isValid()) {
      ctx.addIssue({
        code: 'invalid_date',
        path: ctx.path,
        message: 'Fecha invalida'
      });

      return z.NEVER;
    }

    return date.toDate();
  });
}
