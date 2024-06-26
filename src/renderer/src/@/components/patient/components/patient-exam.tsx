import { zodResolver } from '@hookform/resolvers/zod';
import { updatePatientSchema } from '@main/api/patient/patient.schemas';
import trpcReact from '@renderer/lib/trpc';
import { DataResult } from '@renderer/routes/exams/$examId';
import { getRouteApi } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DatePicker } from '../../ui/date-picker';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../ui/form';
import { Input } from '../../ui/input';

const routeApi = getRouteApi('/exams/$examId');

type RequiredDataResult = Exclude<DataResult, null>;

export function PatientExam({
  patient
}: {
  patient: RequiredDataResult['examResult']['result']['patient'];
}) {
  const queryClient = trpcReact.useUtils();

  const { page } = routeApi.useSearch();

  const updatePatientMutation = trpcReact.patient.update.useMutation({
    onSuccess: () => {
      queryClient.result.getExamResultsPagination.invalidate({ page });
    }
  });

  const form = useForm<z.infer<typeof updatePatientSchema>>({
    resolver: zodResolver(updatePatientSchema),
    defaultValues: {
      name: patient.name,
      birthDate: patient?.birthDate ? dayjs(patient?.birthDate).toDate() : undefined,
      identification: patient?.identification || '',
      idPatient: patient.id
    }
  });

  function updatePatient(values: z.infer<typeof updatePatientSchema>) {
    updatePatientMutation.mutate(values);
  }

  return (
    <div>
      <h2 className="text-xl">Paciente: </h2>
      <Form {...form}>
        <form onBlur={form.handleSubmit(updatePatient)} className="mt-4 flex gap-2">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre: </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="identification"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificacion: </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="birthDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Nacimiento: </FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    toDate={new Date()}
                    onChangeDate={(newDate) => field.onChange(newDate)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
