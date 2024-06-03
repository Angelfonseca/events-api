import { Admin } from "../interfaces/admin.interface";
import EventModel from "../models/events.model";
import { Event } from "../interfaces/events.interface";
import userServices from "../services/users.services";
import admin from "../services/admin.services";
import nodemailer from 'nodemailer';
import { get } from "http";
import adminServices from "../services/admin.services";
import RegisterLogModel from "../models/registerLog.model";


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

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const sendEmails = async (recipients: string[], subject: string, body: string) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: recipients,
    subject: subject,
    text: body
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(`Error al enviar correos electrónicos: ${error.message}`);
  }
}
const getUsersWithCareer = async (career: string): Promise<string[]> => {
  const users = await userServices.getUsers();
  let emails: string[] = [];
  for (const user of users) {
    if (user.career === career) {
      emails.push(user.email);
    }
  }
  if (emails.length === 0) {
    throw new Error(`No se encontraron usuarios con la carrera proporcionada.`);
  }
  return emails;
}

const getUsersWithCareers = async (careers: string[]): Promise<string[]> => {
  const users = await userServices.getUsers();
  let emails: string[] = [];
  for (const user of users) {
    if (careers.includes(user.career)) {
      emails.push(user.email);
    }
  }
  if (emails.length === 0) {
    throw new Error(`No se encontraron usuarios con las carreras proporcionadas.`);
  }
  return emails;
}

const createEvent = async (event: Event): Promise<Event> => {
  try {
    const designedFor = event.designedfor;
    const recipientEmails: string[] = await getUsersWithCareers(designedFor);
    const subject = `Hay un nuevo evento para tu carrera: ${event.title}`;
    const body = `Hola, hay un nuevo evento para tu carrera: ${event.title}. El evento es el ${event.eventDate} y trata sobre: ${event.description}.`;
    
    await sendEmails(recipientEmails, subject, body);
    console.log('Correo electrónico enviado a los usuarios.');
    
    // Crear el evento en la base de datos
    const newEvent = await EventModel.create(event);
    const rl = await RegisterLogModel.create({ event: newEvent.id, UsersAssistance: [], GuessAssistance: [], duration: 0 });
    
    return newEvent;
  } catch (error: any) {
    throw new Error(`Error al crear el evento: ${error.message}`);
  }
};



const deleteEvent = async (id: string, userId: string) => {
  const userIsAdmin = await adminServices.isDocente(userId);
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
      return event;
    } else {
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

const addVisualizedBy = async (id: string) => {
  try {
    const event = await getEventbyId(id.toString());
    if (!event) {
      console.log("Event not found");
      return;
    }
    event.visualizedby += 1;
    await event.save();
    return event;
  } catch (error) {
    console.error("Error incrementing visualized by field:", error);
    return new Error;
  }
}

const userEvents = async (username: string): Promise<Event[] | Error> => {
  try {
    const events = await EventModel.find({ aceptedAssistance: { $in: [username] } });
    console.log("User events found.");
    return events;
  } catch (error) {
    console.error("Error getting user events:", error);
    return new Error("Failed to get user events");
  }
};

const acceptEvent = async (id: string, username: string) => {
  try {
    const event = await EventModel.findById(id);
    if (!event) {
      console.log("Event not found");
      return;
    }
    if (event.aceptedAssistance.includes(username)) {
      console.log("User is already registered.");
      return;
    }
    event.aceptedAssistance.push(username);
    await event.save();
    console.log("User assistance accepted.");
    return event;
  } catch (error) {
    console.error("Error accepting event:", error);
    return new Error;
  }
} 

const isRegistered = async (id: string, username: string) => {
  try {
    const event = await EventModel.findById(id);
    if (!event) {
      console.log("Event not found");
      return;
    }
    if (event.aceptedAssistance.includes(username)) {
      // console.log("User is already registered.");
      return true;
    } else {
      // console.log("User is not registered.");
      return false;
    }
  } catch (error) {
    console.error("Error checking if user is registered:", error);
    return new Error;
  }
}

const deleteAssistance = async (id: string, username: string) => {
  try {
    const event = await EventModel.findById(id);
    if (!event) {
      console.log("Event not found");
      return;
    }
    const index = event.aceptedAssistance.indexOf(username);
    if (index === -1) {
      console.log("User is not registered.");
      return false;
    }
    event.aceptedAssistance.splice(index, 1);
    await event.save();
    console.log("User assistance deleted.");
    return event;
  } catch (error) {
    console.error("Error deleting user assistance:", error);
    return new Error;
  }
}

export default {
  getEvents,
  createEvent,
  deleteEvent,
  getUpdatedEvents,
  addVisualizedBy,
  userEvents,
  acceptEvent,
  isRegistered,
  getEventbyId,
  deleteAssistance
};