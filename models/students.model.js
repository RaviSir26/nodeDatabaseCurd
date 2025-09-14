import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true,
        unique: true
    },
    student_name: {
        type: String,
        require: true
    },
    student_email: {
        type: String,
        require: true,
        unique: true
    },
    student_phone: {
        type: String,
        require: true
    },
    student_gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        require: true
    },
    student_photo: {
        type: String,
        require: true
    } 
});

const Student = mongoose.model('info-students', studentSchema);

export default Student;