import mongoose, { Schema } from "mongoose";
import { collections } from "../config/database";

const userSchema = new Schema({
  id: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  budgets: {
    type: Map,
    of: Number,
    default: () => new Map()
  }
});


export const User = mongoose.model("User", userSchema, collections.users);

