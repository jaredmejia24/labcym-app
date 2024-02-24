import trpcReact from '@renderer/lib/trpc';
import { Button } from '@renderer/@/components/ui/button';

function Exam() {
  const { data, ...rest } = trpcReact.exam.getExams.useQuery();

  console.log({ data, rest });
  return (
    <div className="mt-6">
      <Button onClick={() => console.log('click')}>test button</Button>
    </div>
  );
}

export default Exam;
