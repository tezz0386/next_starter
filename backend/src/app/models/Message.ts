import mongoose from 'mongoose';
import {Schema, Document, Types} from 'mongoose';

export interface MessageInterface extends Document{
    project_id:Types.ObjectId,
    message:String,
    response:String,
    created_at:Date,
    updated_at:Date,
}

const Message: Schema = new mongoose.Schema({
    project_id:{
        type:Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        required: false,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        required: false,
        default: Date.now,
    },
});


export default mongoose.model<MessageInterface>('Message', Message);