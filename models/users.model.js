import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    useremail: {
        type: String,
        require: true,
        unique: true
    },
    userpassword: {
        type: String,
        require: true,
        unique: true
    }, 
    createAt:{
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model('info-users', userSchema);

export default userModel;
