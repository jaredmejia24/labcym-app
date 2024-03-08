import { DatePicker } from '@renderer/@/components/ui/date-picker';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@renderer/@/components/ui/form';
import { Input } from '@renderer/@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/@/components/ui/select';
import trpcReact, { RouterOutputs } from '@renderer/lib/trpc';
import { createFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { searchItemExamSchema } from './index.lazy';

export const Route = createFileRoute('/exams/$examId')({
  component: ItemExam,
  validateSearch: (search) => {
    return searchItemExamSchema.parse(search);
  }
});

function ItemExam() {
  const { examId } = Route.useParams();

  return (
    <div className="mt-2 flex flex-grow flex-col gap-4 p-8">
      <Patient />
      <ItemExamContainer examId={Number(examId)} />
    </div>
  );
}

function Patient() {
  return (
    <div>
      <h2 className="text-xl">Paciente: </h2>
      <PatientInfo />
    </div>
  );
}

function PatientInfo() {
  const { idResult } = Route.useSearch();

  const { data, isLoading } = trpcReact.patient.getOneByResult.useQuery({ idResult });

  // todo type this and create edit function
  const form = useForm({
    defaultValues: {
      name: data?.name,
      identification: data?.identification || undefined,
      birthDate: data?.birthDate ? dayjs(data?.birthDate).toDate() : undefined
    }
  });

  if (isLoading) {
    return (
      <div className="grid place-items-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="mt-4 flex gap-2">
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
  );
}

function ItemExamContainer(props: { examId: number }) {
  const { data, isLoading } = trpcReact.exam.getExamById.useQuery({ idExam: props.examId });

  if (isLoading) {
    return (
      <div className="mt-8 grid flex-grow place-items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl">{data?.name}</h2>
      <div className="mt-6 grid grid-cols-3">
        {data?.examDivision.map((examDivision) => (
          <section className="text-xl" key={examDivision.id}>
            <h2>{examDivision.name}</h2>
            <PropertySection division={examDivision} />
          </section>
        ))}
      </div>
    </div>
  );
}

type Division = RouterOutputs['exam']['getExamById']['examDivision'][number];

type FormValues = {
  [key in string]: string;
};
function PropertySection(props: { division: Division }) {
  const { division } = props;
  console.log(division);

  // todo type this
  const form = useForm<FormValues>();
  console.log(form.getValues());

  return (
    <Form {...form}>
      <form className="mt-4 grid gap-3 text-base">
        {division.quantitativeProperty.map((property) => (
          <FormField
            control={form.control}
            name={'quantitative' + '-' + property.id.toString()}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>{property.name}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder={property.name} />
                </FormControl>
                <span>{property.unity}</span>
              </FormItem>
            )}
          />
        ))}
        {division.qualitativeProperty.map((property) => (
          <FormField
            control={form.control}
            name={'qualitative' + '-' + property.id.toString()}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>{property.name}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[170px]">
                      <SelectValue placeholder={property.name} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {property.qualitativePropertyOption.map((option) => (
                      <SelectItem
                        key={option.propertyOption.id}
                        value={option.propertyOption.id.toString()}
                      >
                        {option.propertyOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );
}
