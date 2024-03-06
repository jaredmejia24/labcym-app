import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@renderer/@/components/ui/form';
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
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/exams/$examId')({
  component: ItemExam
});

function ItemExam() {
  const { examId } = Route.useParams();

  return (
    <div className="flex flex-grow p-8">
      <ItemExamContainer examId={Number(examId)} />
    </div>
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
      <h1 className="text-3xl">{data?.name}</h1>
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
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Theme" />
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
