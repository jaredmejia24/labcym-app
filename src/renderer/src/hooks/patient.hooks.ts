import trpcReact, { RouterOutputs } from '@renderer/lib/trpc';
import { toast } from 'sonner';

type UseCreatePatientMutationParams = {
  onSuccess: (patient: RouterOutputs['patient']['create']) => void;
};
export function useCreatePatientMutation(params?: UseCreatePatientMutationParams) {
  const queryClient = trpcReact.useUtils();

  return trpcReact.patient.create.useMutation({
    onSuccess: (patient) => {
      queryClient.patient.getAll.setData({}, (old) => {
        if (!old) return [];

        return [...old, patient];
      });

      params?.onSuccess(patient);
    },
    onError: (error) => {
      toast(error.message);
    },
    onSettled: () => {
      queryClient.patient.getAll.invalidate();
    }
  });
}
