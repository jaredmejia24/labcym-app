import { ErrorComponent, RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import TrpcProvider from './context/trpc.provider';

import './assets/main.css';
import '@renderer/globals.css';
import { Link } from '@tanstack/react-router';
import { Button } from './@/components/ui/button';

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultErrorComponent: (props) => {
    return (
      <div className="m-4 flex flex-col">
        <Link to="/">
          <Button>Return</Button>
        </Link>
        <ErrorComponent {...props} />
      </div>
    );
  }
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TrpcProvider>
        <RouterProvider router={router} />
      </TrpcProvider>
    </StrictMode>
  );
}
