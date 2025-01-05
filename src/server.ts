import { app } from "./app";

app.listen({
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5000
}).then(() => console.log('runnin at 5000'))