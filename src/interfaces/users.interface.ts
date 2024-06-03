import {Event} from './events.interface'
export interface User {
    name: string;
    username: number;
    email: string;
    password: string;
    career: string;
    semester: number;
    }
    export interface UserEvent {
        user: User;
        events: Event[]; 
    }