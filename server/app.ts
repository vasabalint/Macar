import express from 'express';
import { authenticate } from './middleware/authenticate';
import { handleError, notFound } from './middleware/errorHandlers';
import menuItemsRouter from './routes/menuItems';
import greetingRouter from './routes/greeting';

const app = express();

app.use(express.json({ limit: '100kb' }));

// The greeting page is public so it can be opened directly in a browser.
app.use('/api/v1/greeting', greetingRouter);

// Every menu item endpoint requires a valid token.
app.use('/api/v1/menu-items', authenticate, menuItemsRouter);

// Fallbacks must follow the routes; the error handler must be last.
app.use(notFound);
app.use(handleError);

export default app;
