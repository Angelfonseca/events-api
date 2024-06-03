import { Schema, model, Document } from 'mongoose';
import { Event } from '../interfaces/events.interface';

const EventSchema = new Schema<Event>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  eventDate: { type: Date, required: true },
  designedfor: { type: [String], required: true },
  active: { type: Boolean, required: true},
  visualizedby: { type: Number, required: true},
  aceptedAssistance: { type: [String], required: true } 
});


const EventModel = model<Event>('Event', EventSchema);


export default EventModel;
