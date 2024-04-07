import { zodResolver } from '@hookform/resolvers/zod';
import { createResultSchema } from '@main/api/result/result.schemas';
import DialogNewPatient from '@renderer/@/components/patient/dialog-modal';
import { Button } from '@renderer/@/components/ui/button';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@renderer/@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/@/components/ui/form';
import { Input } from '@renderer/@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/@/components/ui/popover';
import trpcReact, { RouterOutputs } from '@renderer/lib/trpc';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounceValue } from 'usehooks-ts';
import { z } from 'zod';

export const Route = createFileRoute('/results/')({
  component: Results
});

type FormValues = z.infer<typeof createResultSchema>;

function Results() {
  const form = useForm<FormValues>({
    resolver: zodResolver(createResultSchema),
    defaultValues: {
      invoiceNumber: '',
      patientId: undefined
    }
  });

  const navigate = useNavigate({ from: '/results' });

  const resultMutation = trpcReact.result.create.useMutation({
    onSuccess: (newResult) => {
      navigate({ to: '/exams', search: { idResult: newResult.id } });
    },
    onError: (err) => {
      toast(err.message);
    }
  });

  async function createResult(values: FormValues) {
    await resultMutation.mutateAsync(values);
  }

  return (
    <main className="flex flex-grow flex-col p-6">
      <h1 className="text-2xl">Crear Resultado</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createResult)} className="grid gap-8">
          <div className="mt-6 grid gap-3">
            <FacturaSection />
            <PatientSection />
          </div>

          <Button isLoading={resultMutation.isLoading} type="submit" className="justify-self-start">
            Crear Resultado
          </Button>
        </form>
      </Form>
    </main>
  );
}

function FacturaSection() {
  const form = useFormContext<FormValues>();

  return (
    <FormField
      control={form.control}
      name="invoiceNumber"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <FormLabel className="text-md">Factura: </FormLabel>
          <FormControl className="max-w-44">
            <Input {...field} placeholder="factura" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PatientSection() {
  const [open, setOpen] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');
  const [debounceSearch, setDebounceSearch] = useDebounceValue(searchPatient, 300);
  const [selectedPatient, setSelectedPatient] = useState<
    RouterOutputs['patient']['getAll'][number] | null
  >(null);

  const { data: patientOptions, isLoading } = trpcReact.patient.getAll.useQuery({
    search: debounceSearch || undefined
  });

  const form = useFormContext<FormValues>();

  const patientId = form.watch('patientId');

  useEffect(() => {
    const patient = patientOptions?.find((patient) => patient.id === patientId);

    setSelectedPatient(patient || null);
  }, [patientId]);

  return (
    <FormField
      control={form.control}
      name="patientId"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <FormLabel className="text-md">Paciente: </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-56 justify-between text-primary"
              >
                {selectedPatient?.name || 'Seleccione un paciente'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <FormMessage />
            <PopoverContent className="w-56 p-0">
              <FormControl>
                <Command shouldFilter={false}>
                  <CommandInput
                    value={searchPatient}
                    onValueChange={(value) => {
                      setSearchPatient(value);
                      setDebounceSearch(value);
                    }}
                    placeholder="Buscar nombre o identidad"
                  />
                  <CommandGroup className="max-h-32 overflow-y-auto">
                    {isLoading ? (
                      <Loader2 className="grid h-11 w-full animate-spin place-items-center py-2" />
                    ) : (
                      patientOptions?.map((patient) => (
                        <CommandItem
                          {...field}
                          className="cursor-pointer py-3"
                          key={patient.id}
                          value={patient.id.toString()}
                          onSelect={() => {
                            const newValue = patient.id === field.value ? null : patient;
                            setSelectedPatient(newValue);

                            field.onChange(newValue?.id || null);

                            setOpen(false);
                          }}
                        >
                          {patient.name}
                        </CommandItem>
                      ))
                    )}
                    <CommandItem className="p-0p cursor-pointer p-0">
                      <DialogNewPatient />
                    </CommandItem>
                  </CommandGroup>
                </Command>
              </FormControl>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
