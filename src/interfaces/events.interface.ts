import { User } from './users.interface';

export 
    interface Event {
        user: User
        title: string;
        description: string;
        eventDate: Date;
        type: string;
    }

