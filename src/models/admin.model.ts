import { Schema, model, Document } from 'mongoose';
import { Admin } from '../interfaces/admin.interface';
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
const AdminSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isdocente: { type: Boolean, required: true },
    haspermission: { type: Boolean, required: true },
});

AdminSchema.pre('save', function(next) {
    const admin = this;

    if (!admin.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err: any, salt: any) {
        if (err) return next(err);

        bcrypt.hash(admin.password, salt, function(err: any, hash: any) {
            if (err) return next(err);
            admin.password = hash;
            next();
        });
    });
});

AdminSchema.methods.comparePassword = function(candidatePassword: any, cb: any) {
    bcrypt.compare(candidatePassword, this.password, function(err: any, isMatch: any) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
      
const AdminModel = model<Admin>('Admin', AdminSchema);

export default AdminModel;