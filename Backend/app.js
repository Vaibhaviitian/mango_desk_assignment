import e from 'express';
import cors from 'cors';
const app = e();
app.use(
    cors({
    origin: "*",//i will add frontend url later
    credentials: true,
  }));
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

import mainrouter from './Routes/main.routes.js';
app.use('/api', mainrouter);
export default app;