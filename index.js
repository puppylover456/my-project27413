import express from 'express'
import multer from 'multer'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { registerValidation, loginValidation, postCreateValidation } from './validations/validations.js' 

import  UserModel from './models/user.js'

import checkAuth from './utils/checkAuth.js'

import { register,login,getMe} from './controllers/UserController.js'
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

import handleValidationErrors from './utils/handleValidationErrors.js'
mongoose.connect('mongodb+srv://admin:ananass234@cluster0.xia0nja.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0',
)
.then(() => console.log('DB OK'))
.catch((err) => console.log('DB error', err));

const app = express();


const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, 'uploads');
    },
    filename: (_, file, cb) =>{
        cb(null, file.originalname);
    },



});

const upload = multer({ storage })

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.get('/',(req,res) => {
res.send('Hello world')

});



app.post('/auth/login',loginValidation,handleValidationErrors, UserController.login, async (req,res)=> {
    try {
        const user = await UserModel.findOne({ email: req.body.email});

        if (!user){
            return res.status(404).json({

                message: 'Пользователь не найден',
            });


        }

        const isValidPass = await bcrypt.compare(req.body.password,user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message:'Неверный логин или пароль'
            });
        }

        const token = jwt.sign(
        {

        _id: user._id,
    },
    'secret123',
    {
        expiresIn: '30d',
    },


);

const {passwordHash, ... userData} = user._doc;

    res.json({
        ... userData,
        token,
});
    } catch (err) {
        
        console.log(err);
res.status(500).json({

    message: 'Не удалость авторизоваться'
});
    }


})

app.post('/auth/register' ,registerValidation ,handleValidationErrors, UserController.register,async (req,res)=>{
try {
    const errors = validationResult(req);
    if (!errors.isEmpty()){

        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({

        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
        {

        _id: user._id,
    },
    'secret123',
    {
        expiresIn: '30d',
    },


);

const {passwordHash, ... userData} = user._doc;

    res.json({
        ... userData,
        token,
});
    } catch (err) {
        console.log(err);
res.status(500).json({

    message: 'Не удалость зарегистрироваться'
});

    }

});

app.get('/auth/me', checkAuth ,UserController.getMe, async (req,res) =>
{
    try {
            const user = await UserModel.findById(req.userId);

            if (!user) {
                return res.status(404).json({
                    message: "Пользователь не найден"
                });
            }

            const {passwordHash, ... userData} = user._doc;

    res.json(userData);
    

    } catch (err) {}



});



app.post('/upload',upload.single('image'), (req,res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })

}) 


 app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth,postCreateValidation,handleValidationErrors,PostController.create)
app.delete('/posts/:id', checkAuth ,PostController.remove)
app.patch('/posts/:id', checkAuth,postCreateValidation,handleValidationErrors, PostController.update)


app.listen(4444, (err) => {

    if  (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
