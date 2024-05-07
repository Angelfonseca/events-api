import mongoose, { Schema, Document } from 'mongoose';
import event from './events.model'

const registerLogSchema = new Schema({
    event: { type: event, required: true },
    UsersAssistance: { type: Array, required: true }
    });

const RegisterLogModel = mongoose.model('RegisterLog', registerLogSchema);
