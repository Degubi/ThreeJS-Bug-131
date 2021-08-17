import express from 'express';
import { resolve } from 'path';

const workDir = resolve();
const server = express();

server.use(express.static(`${workDir}`));
server.get('/', (_, res) => res.sendFile(`${workDir}/viewer.html`));
server.listen(process.env.PORT ?? 8080);