import express from 'express';
import runGraph from './ai/graph.ai.js'
import chatRouter from '../src/routes/chat.routes.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    credentials: true
}))


app.use("/api/chats", chatRouter)

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Battle Arena Backend Running 🚀",
  });
});

// app.get('/', async (req, res) => {
    
//     const result = await runGraph("Write an code for Factorial function in js")

//     res.json(result)
// })

// app.post("/invoke", async (req, res) => {

//     const { input } = req.body
//     const result = await runGraph(input)

//     res.status(200).json({
//         message: "Graph executed successfully",
//         success: true,
//         result
//     })
// })

export default app