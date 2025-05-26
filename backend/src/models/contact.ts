import mongoose, { Schema, Types } from "mongoose";

export type LinkPrecedence = "primary" | "secondary";

export interface ContactType extends Document{
    _id: Types.ObjectId;
    id : number;
    phoneNumber?: string;
    email ?: string;
    linkedId ?: number;
    linkedPrecedence : LinkPrecedence;
    createdAt : Date;
    updatedAt : Date;
    deleteAt ?: Date;
}

const ContactSchema = new Schema<ContactType>(
    {   
        id: {
            type: Number,
            required : true,
            unique : true
        },
        phoneNumber: {
            type: String,
            default: null
        },
        email:{
            type: String,
            default: null
        },
        linkedId:{
            type: Number,
            ref : 'Contact',
            default: null
        },
        linkedPrecedence:{
            type: String,
            enum: ['primary', 'secondary'],
            required: true
        },
        deleteAt: {
            type : Date,
            default: null
        }
    },
    {
        timestamps: true,
        _id : true,
    }
)

const Contact = mongoose.model<ContactType>("Contact",ContactSchema);

export default Contact;