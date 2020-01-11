import app from './app';

const { PORT = 8080 } = process.env;
app.listen(PORT, () => console.log(`Listening on port https://127.0.0.1:${PORT}`)); // eslint-disable-line no-console
