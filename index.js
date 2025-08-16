import express from 'express';
import mongoose from 'mongoose';
import studentRoutes from "./routes/student.routes.js";
import { MulterError } from 'multer';
import cors from 'cors';
import path from 'path';

const app = express();

// Database Connected
mongoose.connect('mongodb://127.0.0.1:27017/student-curd')
.then(()=> console.log('Connected To MongoDB'))
.catch((error)=> console.log(error))

// Middleware
app.use(express.json());

app.use('/uploads', express.static(path.join(import.meta.dirname, 'uploads')));

// app.use('/uploads', express.static("./uploads"));
app.use(cors());
// Api Routes
app.use('/api/students', studentRoutes);


// Middleware
app.use((error, req, res, next)=>{
    if(error instanceof MulterError){
        return res.status(400).send(`Iamge Error: ${error.message} ${error.code}`);
    }else if(error){
        return res.status(500).send(`Something went wrong:${error.message} `);
    }
    next();
})

let PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`server will be started ${PORT} Port`);
});