import { Application } from 'https://deno.land/x/abc/mod.ts';
import { cors, CORSConfig, DefaultCORSConfig } from 'https://deno.land/x/abc/middleware/cors.ts'

import { CONFIG } from './cors.ts';

import 'https://deno.land/x/dotenv/load.ts';
// https://github.com/vlucas/phpdotenv/issues/76#issuecomment-87252126 | Use a service...

import routes from './routes/index.ts';

const app: Application = new Application();

routes(app);

const productionMode: boolean = Boolean(Deno.env.get('production'));
const port: number = Number(Deno.env.get('SERVER_PORT')) || 8080;


if (productionMode) {
    // ENV
    const certFile: string = Deno.env.get('SSL_CERT') || '';
    const keyFile: string = Deno.env.get('SSL_KEY') || '';
    const hostname: string = Deno.env.get('SERVER_HOSTNAME') || '';
    const corsConfig = CONFIG !== undefined ? CONFIG : DefaultCORSConfig;
    app.use(cors(corsConfig));

    app.startTLS({ port, certFile, keyFile, hostname })
} else {
    app.start({ port });
}
