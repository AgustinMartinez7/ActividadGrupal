const express = require("express")
const app = express()
const cors = require("cors")
const PORT = process.env.PORT || 4000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const postsRouter = require('./routers/postsRoutes');
app.use("/api/posts", postsRouter);

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            status: err.status,
            message: err.message || 'Ha ocurrido un error en el servidor.',
            stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
        }
    })
})

app.listen(PORT, () => {
    console.log(`Lograste levantar el server en el PORT: ${PORT}!!! 🚀 `)
})