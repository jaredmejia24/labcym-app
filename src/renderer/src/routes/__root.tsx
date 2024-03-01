import { Toaster } from '@renderer/@/components/ui/sonner';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <main className="flex min-h-dvh min-w-full">
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </main>
  )
});
