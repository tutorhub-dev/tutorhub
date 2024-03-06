const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config();


const app = express()
const port = 3000

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MDB_URL);
        console.log("Database Connected");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        Process.exit(1);
    }
}

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

