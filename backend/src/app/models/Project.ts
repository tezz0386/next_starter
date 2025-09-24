import mongoose from 'mongoose';
import {Schema, Document, Types} from 'mongoose';

export interface ProjectInterface extends Document{
    user_id:Types.ObjectId,
    name:String,
    folder_path:String,
    created_at:Date,
    updated_at:Date,
}

const Project: Schema = new mongoose.Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: false,    
    },
    name: {
        type: String,
        required: true,
    },
    folder_path: {
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


export default mongoose.model<ProjectInterface>('Project', Project);