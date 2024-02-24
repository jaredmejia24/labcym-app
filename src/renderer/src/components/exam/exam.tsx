import trpcReact from '@renderer/lib/trpc';

function Exam() {
  const { data, ...rest } = trpcReact.exam.getExams.useQuery();

  console.log({ data, rest });
  return <div>test exam</div>;
}

export default Exam;
