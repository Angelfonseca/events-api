import { User } from "../interfaces/users.interface";
import EventModel from "../models/events.model";
import { Event } from "../interfaces/events.interface";
import userServices from "../services/users.services";
import admin from "../services/admin.services";
import nodemailer from 'nodemailer';
import { get } from "http";


const getEvents = async () => {
  const events = await EventModel.find();
  return events;
};
const getEventbyId = async (id: string) => {
  const event = await EventModel.findById(id);
  if (!event) {
    throw new Error(`No se encontró el evento con el ID proporcionado.`);
  }
  return event;
};
const getActiveEvents = async () => {
  const events = await EventModel.find({ active: true });
  return events;
};

const sendEmails = async (to: string[], subject: string, body: string): Promise<void> => {
  const email= process.env.EMAIL;
  const password= process.env.PASSWORD;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password
      }
    });

    for (const recipient of to) {
      const mailOptions = {
        from: email,
        to: recipient,
        subject: subject,
        text: body
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (error: any) {
    throw new Error(`Error al enviar el correo electrónico: ${error.message}`);
  }
};

const createEvent = async (event: Event): Promise<Event> => {
  // Verifica si el usuario es administrador
  const userId = event.user.toString();
  const userIsAdmin = await admin.isDocente(userId);
  if (!userIsAdmin) {
    console.log('El usuario no tiene permisos de administrador para crear eventos.');
  }
  try {
    const recipientEmails: string[] = await userServices.getNoAdminsEmail();

    const subject = `Nuevo evento: ${event.title}`;
    const body = `Nuevo evento creado: ${event.title}\nDescripción: ${event.description}`;
    await sendEmails(recipientEmails, subject, body);
    console.log('Correo electrónico enviado a los usuarios.');
    const newEvent = await EventModel.create(event);
    return newEvent;
  } catch (error: any) {
    throw new Error(`Error al crear el evento: ${error.message}`);
  }
};

const deleteEvent = async (id: string, userId: string) => {
  const userIsAdmin = await userServices.isAdmin(userId);
  if (!userIsAdmin) {
    throw new Error(`El usuario no tiene permisos de administrador para eliminar eventos.`);
  }

  try {
    const event = await EventModel.findByIdAndDelete(id);

    if (!event) {
      throw new Error(`No se encontró el evento con el ID proporcionado.`);
    }
    return event;
  } catch (error: any) {
    throw new Error(`Error al eliminar el evento: ${error.message}`);
  }
}
const dateCheck = async (id: String) => {
  try {
    const event = await getEventbyId(id.toString());
    if (!event) {
      console.log("Event not found");
      return;
    }
    const eventDate = new Date(event.eventDate);
    const currentDate = new Date();
    if (eventDate < currentDate) {
      event.active = false;
      await event.save(); 
      console.log("Event date is in the past. 'activo' field set to false.");
      return event;
    } else {
      console.log("Event date is in the future.");
      return event;
    }
  } catch (error) {
    console.error("Error checking event date:", error);
  }
};

const getUpdatedEvents = async () => {
  try {
    const events = await getActiveEvents();
    const activeEvents = [];

    for (const event of events) {
      const updatedEvent = await dateCheck(event._id.toString());
      if (updatedEvent && updatedEvent.active) {
        activeEvents.push(updatedEvent);
      }
    }

    return activeEvents;
  } catch (error) {
    console.error("Error getting and checking events:", error);
    return [];
  }
};


export default {
  getEvents,
  createEvent,
  deleteEvent,
  getUpdatedEvents
};