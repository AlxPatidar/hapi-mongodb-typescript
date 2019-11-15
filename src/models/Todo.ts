import * as Mongoose from "mongoose";

export class TodoClass {
  task: string;
  userId: string;
  completed: boolean;
}

export interface ITodo extends Mongoose.Document {
  task: string;
  userId: string;
  completed: boolean;
  status: boolean;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// create a schema
export const todoSchema = new Mongoose.Schema(
  {
    userId: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    task: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false }
  },
  {
    // Automatically include createdAt and updatedAt field
    timestamps: true,
    // Remove default key _v
    versionKey: false
  }
);

export const Todo = Mongoose.model<ITodo>("Todo", todoSchema);
