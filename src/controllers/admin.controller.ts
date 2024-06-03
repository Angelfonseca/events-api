import e, { Request, Response } from 'express';
import { Admin } from '../interfaces/admin.interface'; 
import AdminModel from '../models/admin.model'; 
import adminService from '../services/admin.services';
import adminServices from '../services/admin.services';
import { handleHttp } from '../utils/error.handle';
import { get } from 'http';

const getAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await adminServices.getAdmins();
        res.status(200).json(admins);
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO GET ADMINS");
    }
};

const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await adminServices.deleteAdmin(id);
        res.status(204).end();
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO DELETE ADMIN");
    }
};

const createAdmin = async (req: Request, res: Response) => {
    try {
        const admin: Admin = req.body; 
        const newAdmin = await adminServices.createAdmin(admin);
        res.status(201).json(newAdmin);
    } catch (error: any) {
        handleHttp(res, 500, "Error creating admin");
        console.error('Error creating admin: ', error);
    }
};

const getAdminById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const admin = await adminServices.getAdminById(id);
        res.status(200).json(admin);
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO GET ADMIN");
    }
};

const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const admin: Admin = req.body;
        const updatedAdmin = await adminServices.updateAdmin(id, admin);
        res.status(200).json(updatedAdmin);
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO UPDATE ADMIN");
    }
};

const getAdminByUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const admin = await adminServices.getAdminByUsername(username);
        res.status(200).json(admin);
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO GET ADMIN");
    }
};

const getUserEvents = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const events = await adminServices.getUserEvents(username);
        res.status(200).json(events);
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO GET USER EVENTS");
    }
};

const getUserswithcredit = async (req: Request, res: Response) => {
    try {
        const users = await adminServices.getUserswithcredit();
        res.status(200).json(users);
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO GET USERS WITH CREDIT");
    }
};

const getUserHours = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const hours = await adminServices.getUserHours(id);
        res.status(200).json(hours);
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO GET USER HOURS");
    }
};

export default {
    getAdmins,
    createAdmin,
    deleteAdmin,
    getAdminById,
    updateAdmin,
    getAdminByUsername,
    getUserEvents,
    getUserHours,
    getUserswithcredit
    
};