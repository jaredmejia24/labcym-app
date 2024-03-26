import { RouterOutputs } from '@renderer/lib/trpc';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function PropertyExam({ exams }: { exams: RouterOutputs['exam']['getExamById'] }) {
  return (
    <div>
      <h2 className="text-2xl">{exams?.name}</h2>
      <div className="mt-6 grid grid-cols-3">
        {exams?.examDivision.map((examDivision) => (
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

  // todo type this
  const form = useForm<FormValues>();
  //console.log(form.getValues());

  return (
    <Form {...form}>
      <form className="mt-4 grid gap-3 text-base">
        {division.quantitativeProperty.map((property) => (
          <FormField
            key={property.id}
            control={form.control}
            name={'quantitative' + '-' + property.id.toString()}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 ">
                <FormLabel>{property.name}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-[170px]"
                    type="number"
                    placeholder={property.name}
                  />
                </FormControl>
                <span>{property.unity}</span>
              </FormItem>
            )}
          />
        ))}
        {division.qualitativeProperty.map((property) => (
          <FormField
            key={property.id}
            control={form.control}
            name={'qualitative' + '-' + property.id.toString()}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>{property.name}</FormLabel>
                <Select onValueChange={field.onChange}>
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
