import { User } from "../interfaces/users.interface";
import {EmailLogModel, EventLogModel} from "../models/eventsLog.model";
import EventModel from "../models/events.model";
import { Event } from "../interfaces/events.interface";
import userServices from "../services/users.services";
import nodemailer from 'nodemailer';

const getEvents = async () => {
  const events = await EventModel.find();
  return events;
};
const sendEmails = async (to: string[], subject: string, body: string): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: 'tudirecciondecorreo@outlook.com',
        pass: 'tucontraseña'
      }
    });

    for (const recipient of to) {
      const mailOptions = {
        from: 'tudirecciondecorreo@outlook.com',
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

export const createEvent = async (event: Event, userId: string): Promise<Event> => {
  // Verifica si el usuario es administrador
  const userIsAdmin = await userServices.isAdmin(userId);
  if (!userIsAdmin) {
    throw new Error(`El usuario no tiene permisos de administrador para crear eventos.`);
  }

  try {
    // Crea un nuevo evento
    const newEvent = await EventModel.create(event);

    // Obtiene usuarios que no son administradores
    const nonAdminUsers: User[] = await userServices.getNoAdmins();
    const recipientEmails: string[] = nonAdminUsers.map((user) => user.email);

    // Envía notificaciones por correo electrónico
    const subject = `Nuevo evento: ${newEvent.title}`;
    const body = `Nuevo evento creado: ${newEvent.title}\nDescripción: ${newEvent.description}`;
    await sendEmails(recipientEmails, subject, body);

    // Registra el evento en el registro de eventos
    await EventLogModel.create({
      eventId: newEvent._id,
      eventName: newEvent.title,
      eventDescription: newEvent.description,
      userId: userId,
      eventType: 'created',
      timestamp: new Date(),
    });

    // Registra el envío de correo electrónico en el registro de correo electrónico
    await Promise.all(recipientEmails.map(async (email) => {
      await EmailLogModel.create({
        eventId: newEvent._id,
        email: email,
        subject: subject,
        body: body,
        timestamp: new Date(),
      });
    }));

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

    await EventLogModel.create({
      eventId: event._id,
      eventName: event.title,
      eventDescription: event.description,
      userId,
      eventType: 'deleted',
      timestamp: new Date(), // Utiliza la fecha actual
    });

    return event;
  } catch (error: any) {
    throw new Error(`Error al eliminar el evento: ${error.message}`);
  }
}

export default {
  getEvents,
  createEvent,
  deleteEvent,
};