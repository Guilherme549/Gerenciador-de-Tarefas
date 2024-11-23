import express from "express"
import "express-async-errors"
import { errorHandling } from "./middleware/error-handling"
import { routes } from "./routes/index-routes"


const app = express()

app.use(express.json())
app.use(routes)

app.use(errorHandling)
export { app }