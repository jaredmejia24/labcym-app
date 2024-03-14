import { useForm, useFormContext } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

import { zodResolver } from '@hookform/resolvers/zod';

import { createPatientSchema } from '@main/api/patient/patient.schemas';
import { useCreatePatientMutation } from '@renderer/hooks/patient.hooks';
import { RouterInputs } from '@renderer/lib/trpc';
import { useState } from 'react';
import { DatePicker } from '../ui/date-picker';

function DialogNewPatient() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-fit w-full justify-start border-none bg-transparent p-2 py-2 hover:bg-transparent"
          variant="outline"
        >
          Crear Paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-primary-foreground text-primary sm:max-w-[425px]">
        <DialogContentPatient setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

function DialogContentPatient({ setOpen }: { setOpen: (open: boolean) => void }) {
  const form = useForm<RouterInputs['patient']['create']>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      birthDate: undefined,
      identification: '',
      name: ''
    }
  });

  const formResultado = useFormContext();

  const patientMutation = useCreatePatientMutation({
    onSuccess: (patient) => {
      setOpen(false);
      formResultado.setValue('patientId', patient.id, { shouldValidate: false });
    }
  });

  async function submitForm(values: RouterInputs['patient']['create']) {
    await patientMutation.mutateAsync(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)}>
        <DialogHeader>
          <DialogTitle className="mb-4">Crear nuevo paciente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificacion (opcional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value !== '' && !/^\d{1,20}$/.test(value)) {
                        return;
                      }

                      field.onChange(e);
                    }}
                    placeholder="identificacion"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <FormControl>
                  <DatePicker
                    toDate={new Date()}
                    date={field.value}
                    onChangeDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="mt-6">
          <Button isLoading={patientMutation.isLoading} type="submit">
            Guardar cambios
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default DialogNewPatient;
