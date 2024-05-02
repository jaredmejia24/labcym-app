import { z } from 'zod';
import { createPropertyResultSchema } from './property-result.schemas';

async function createResultProperties(body: z.infer<typeof createPropertyResultSchema>) {
    // do stuff
    
}
