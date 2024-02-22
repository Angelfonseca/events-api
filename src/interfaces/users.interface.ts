import {Event} from './events.interface'
export interface User {
    _id: number;
    name: string;
    username: number;
    email: string;
    password: string;
    admin: boolean;
    }
    export interface UserEvent {
        user: User;
        events: Event[]; 
    }