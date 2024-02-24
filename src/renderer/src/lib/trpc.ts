import { createTRPCReact, inferReactQueryProcedureOptions } from '@trpc/react-query';
import type { AppRouter } from '../../../main/api/router';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

// infer the types for your router
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const trpcReact = createTRPCReact<AppRouter>();

export default trpcReact;
