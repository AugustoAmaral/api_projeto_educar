import { model, Schema } from 'mongoose';
import { User } from './types';
const bcrypt = require('bcryptjs');

export const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

export const UserModel = model<User>('User', userSchema);
