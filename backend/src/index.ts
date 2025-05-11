import express from 'express';

const app = express();
const PORT = 5000;

app.get('/', (_, res) => {
  res.send('Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
