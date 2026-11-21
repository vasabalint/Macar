import express from 'express';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.listen(PORT, () => {
	console.log(`API running on http://localhost:${PORT}/api/v1`);
});

export default app;
