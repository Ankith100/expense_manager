import { Request, Response } from 'express';
import * as authService from '../services/auth';

const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'name, email and password are required' });
        }
        const user = await authService.registerUser(name, email, password);
        return res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        if (message === 'User with this email already exists') {
            return res.status(409).json({ message });
        }
        return res.status(500).json({ message: 'Registration failed', error });
    }
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const { token, user } = await authService.loginUser(email, password);
        return res.json({ message: 'Login successful', token, user });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Login failed';
        if (message === 'Invalid email or password') {
            return res.status(401).json({ message });
        }
        return res.status(500).json({ message: 'Login failed', error });
    }
};

export const authController = { registerUser, loginUser };