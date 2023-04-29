import { createApp } from "./app";

const PORT = process.env.SERVER_PORT
let app = createApp()

app.listen(PORT, () => {
    console.log("Hello World!")
})
