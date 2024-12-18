import { app } from "./app";

app.listen({
    port: Number(process.env.PORT)
}).then(() => console.log('runnin at 5000'))