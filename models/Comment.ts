import mongoose, { Schema, Document } from "mongoose"

export interface IComment extends Document {
  gameUrl: string
  name: string
  email?: string
  message: string
  createdAt: Date
}

const CommentSchema: Schema = new Schema({
  gameUrl: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: false },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema)
