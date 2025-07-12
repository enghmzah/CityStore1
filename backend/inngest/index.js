import { Inngest } from "inngest";
import User  from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "city-store-masr" });

// Create an empty array where we'll export future Inngest functions

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    const {id, first_name,last_name, email_addresses ,image_url } =- event.data 
    const userData = { 
        _id :id ,
        email : email_addresses[0].email_addresses, 
        name: first_name+ ' '+ last_name ,
        image : image_url
    }
    await User.Create(userData)
  },
);


const syncUserDelation = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    const {id}=event.data
    await User.findByIdAndDelete(id)
  },
);

const syncUserUpdating = inngest.createFunction(
  { id: "uodate-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event, step }) => {
    const {id, first_name,last_name, email_addresses ,image_url } =- event.data 
    const userData = { 
        _id :id ,
        email : email_addresses[0].email_addresses, 
        name: first_name+ ' '+ last_name ,
        image : image_url
    }
    await User.findByIdAndUpdate(id,userData)
  },
);





export const functions = [
    syncUserCreation,
    syncUserDelation,
    syncUserUpdating,
];