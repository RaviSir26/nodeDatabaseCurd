import express from 'express';
import mongoose from 'mongoose';
import studentRoutes from "./routes/student.routes.js";
import userRoutes from "./routes/users.routes.js";
import jwtAuth from './middlewares/auth.js'
import { MulterError } from 'multer';
import cors from 'cors';
import path from 'path';

const app = express();

// Database Connected
mongoose.connect(process.env.MONGODB_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> console.log('Connected To MongoDB'))
.catch((error)=> console.log(error))

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static(path.join(import.meta.dirname, 'uploads')));

// app.use('/uploads', express.static("./uploads"));

app.use(cors({
    origin: "https://students-curd.netlify.app",
    // origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


//jwt auth router
app.use('/users', userRoutes);
// app.use(jwtAuth);

// Api Routes
app.use('/students', jwtAuth ,studentRoutes);


// Middleware
app.use((error, req, res, next)=>{
    if(error instanceof MulterError){
        return res.status(400).send(`Iamge Error: ${error.message} ${error.code}`);
    }else if(error){
        return res.status(500).send(`Something went wrong:${error.message} `);
    }
    next();
})

let PORT = process.env.PORT || 4001;

app.listen(PORT, ()=>{
    console.log(`server will be started ${PORT} Port`);
});