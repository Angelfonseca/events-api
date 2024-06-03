import { Schema, model } from 'mongoose';
import {User} from '../interfaces/users.interface';
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  name: {
     type: String,
      required: true
     },
  email: {
     type: String,
      required: true 
    },
  username: {
        type: Number,
        required: true
    },
  password: {
     type: String,
     required: true
    },
  career: {
     type: String,
     required: true
    },
  semester: {
     type: Number,
     required: true
    }
});

UserSchema.pre('save', function(next) {
    var user = this;
  
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
  
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err: any, salt: any) {
        if (err) return next(err);
  
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err: any, hash: any) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
  });
     
  UserSchema.methods.comparePassword = function(candidatePassword: any, cb: any) {
    bcrypt.compare(candidatePassword, this.password, function(err: any, isMatch: any) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
  };
      
  
  const User = model("User", UserSchema)
  
  export default User