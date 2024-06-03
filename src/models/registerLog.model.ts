import mongoose, { Schema, Document } from 'mongoose';

const registerLogSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'event' },
    UsersAssistance: { type: Array, required: true },
    GuessAssistance: { type: Array, required: true },
    duration: { type: Number, required: true }
    });

const RegisterLogModel = mongoose.model('RegisterLog', registerLogSchema);

export default RegisterLogModel;
