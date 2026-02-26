import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';
import { v4 as uuidv4 } from 'uuid'

export const registerUser = async (name: string, email: string, password: string) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const userId = uuidv4() 

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ id:userId, name, email, password: hashedPassword });
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();
    return { token, user: userWithoutPassword };
};


