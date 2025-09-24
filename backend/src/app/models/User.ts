import mongoose from 'mongoose';
import type {Schema, Document} from 'mongoose';

export interface UserInterface extends Document{
    name:String,
    email:String,
    password:String,
}

const User: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});


export default mongoose.model<UserInterface>('User', User);