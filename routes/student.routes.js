// Image Upload Code
import express from 'express';
const router = express.Router();
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Student from '../models/students.model.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        let newFileName = Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Only images are allowed!'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 }
});

// Get All Student Data
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// Read Single Student Data
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student Data Not Found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add New Student Data
router.post('/', upload.single('student_photo'), async (req, res) => {
    try {
      // const newStudent = await Student.create(req.body);
        const studentPhoto = await Student(req.body);
        if(req.file) {
            studentPhoto.student_photo = req.file.filename;
        }
        const newStudent = await studentPhoto.save();
        res.status(201).json(newStudent)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// Update Student Data
router.put('/:id',upload.single('student_photo'), async (req, res) => {
    try {
        const existingStudent = await Student.findById(req.params.id);

        // if (!existingStudent) return res.status(404).json({ message: "Student Data Not Found" });
        
        // duplicate Image Remove Code
        if (!existingStudent) {
            if(req.file.filename){
                const filePath = path.join('./uploads', req.file.filename)
                fs.unlink(filePath, (err)=>{
                    if(err) console.log('Failed to Delete image: ', err);
                })
            }
            return res.status(404).json({ message: "Student Data Not Found" });
        }

        // Image Update code
        if(req.file){
            if(existingStudent.student_photo){
                const oldImagePath = path.join('./uploads', existingStudent.student_photo)
                fs.unlink(oldImagePath, (err)=>{
                    if(err) console.log('Failed To Image Update...', err);
                });
            }
            req.body.student_photo = req.file.filename;
        }        

        const updateStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updateStudent);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// Delete Student Data
router.delete('/:id', async (req, res) => {
    try {
        const deleteStudent = await Student.findByIdAndDelete(req.params.id);
        // User Delete Code
        if (!deleteStudent) return res.status(404).json({ message: "Student Data Not Found" });

        // Image delete Code
        if (deleteStudent.student_photo) {
            let filePath = path.join('./uploads', deleteStudent.student_photo);

            fs.unlink(filePath, (err) => {
                if (err) console.log("Failed To Delete Image...", err)
            })
        }

        res.json({ message: "Student Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

export default router;

