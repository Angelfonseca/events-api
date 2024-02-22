import mongoose, { Schema, Document } from 'mongoose';
import User from './users.model'

// Interfaz para un registro de evento en la base de datos
interface EventLog extends Document {
  eventId: string;
  eventName: string;
  eventDescription: string;
  userId: string;
  users: User[];
  eventType: string;
  timestamp: Date;
}

// Interfaz para un registro de correo electrónico en la base de datos
interface EmailLog extends Document {
  eventId: string;
  userId: string;
  users: User[];
  email: string;
  subject: string;
  body: string;
  timestamp: Date;
}


const eventLogSchema = new Schema({
  eventId: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDescription: { type: String, required: true },
  userId: { type: String, required: true },
  users: {type: Array, required: true},
  eventType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});


const emailLogSchema = new Schema({
  eventId: { type: String, required: true },
  email: { type: String, required: true },
  users: {type: Array, required: true},
  subject: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});


const EventLogModel = mongoose.model<EventLog>('EventLog', eventLogSchema);

const EmailLogModel = mongoose.model<EmailLog>('EmailLog', emailLogSchema);

export { EventLogModel, EmailLogModel };
