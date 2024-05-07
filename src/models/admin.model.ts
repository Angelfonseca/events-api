import { Schema, model, Document } from 'mongoose';
import { Admin } from '../interfaces/admin.interface';

const AdminSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isdocente: { type: Boolean, required: true }
});

const AdminModel = model<Admin>('Admin', AdminSchema);

export default AdminModel;