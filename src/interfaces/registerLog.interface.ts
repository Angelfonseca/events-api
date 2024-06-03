import { Event } from './events.interface';

export interface RegisterLog {
    event: Event;
    UsersAssistance: string[];
    GuessAssistance: string[];
    duration: number;
}