import express from 'express';
import { authenticate } from './middleware/authenticate';
import menuItemsRouter from './routes/menuItems';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Every menu item endpoint requires a valid token.
app.use('/api/v1/menu-items', authenticate, menuItemsRouter);

app.listen(PORT, () => {
	console.log(`API running on http://localhost:${PORT}/api/v1`);
});

export default app;
