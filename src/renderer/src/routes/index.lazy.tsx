import { Button } from '@renderer/@/components/ui/button';
import { Link, createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index
});

function Index() {
  return (
    <section className="flex flex-grow items-center justify-center gap-6">
      <Link to="/results">
        <Button>Crear Resultado</Button>
      </Link>
      {/* <Link to="/exams">
        <Button>Configuracion</Button>
      </Link> */}
    </section>
  );
}
