import { app } from "./app";

app.listen({
    port: Number(process.env.PORT) || 5000
}).then(() => console.log('runnin at 5000'))