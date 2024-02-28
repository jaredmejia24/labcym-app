import DialogNewPatient from '@renderer/@/components/patient/dialog-modal';
import { Button } from '@renderer/@/components/ui/button';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@renderer/@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/@/components/ui/popover';
import trpcReact, { RouterOutputs } from '@renderer/lib/trpc';
import { createLazyFileRoute } from '@tanstack/react-router';
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

export const Route = createLazyFileRoute('/results/')({
  component: Results
});

function Results() {
  return (
    <main className="flex flex-grow flex-col p-6">
      <h1 className="text-2xl">Crear Resultado</h1>
      <PatientSection />
    </main>
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

  return (
    <section>
      <h4 className="mb-3 mt-5 text-xl">Paciente:</h4>
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
        <PopoverContent className="w-56 p-0">
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
                    className="cursor-pointer py-3"
                    key={patient.id}
                    value={patient.id.toString()}
                    onSelect={() => {
                      setSelectedPatient(patient.id === selectedPatient?.id ? null : patient);
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
        </PopoverContent>
      </Popover>
    </section>
  );
}
