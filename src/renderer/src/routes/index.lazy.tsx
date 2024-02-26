import { Button } from '@renderer/@/components/ui/button';
import { Link, createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index
});

function Index() {
  return (
    <section className="flex-grow flex gap-6 justify-center items-center">
      <Link to="/">
        <Button>Crear Resultado</Button>
      </Link>
      <Link to="/config/exams">
        <Button>Configuracion</Button>
      </Link>
    </section>
  );
}
