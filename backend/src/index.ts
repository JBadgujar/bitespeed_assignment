import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Contact from './models/contact';


const app = express();
const PORT = process.env.PORT || 3000;
// const MONGO_URI = "mongodb+srv://badgujarjayesh02:6Rn7Z6gHzdKVYwml@cluster0.n8grawl.mongodb.net/contact"

interface IdentifyResponse {
  contact: {
    primaryContatctId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contact')
    .then(() => console.log("Connected to Mongoose"))
    .catch((err: Error) => console.log("Mongoose connection error:", err.message))

app.use(express.json())

app.use((req: Request, res: Response, next: express.NextFunction): any => {
    if (req.headers['content-type'] !== 'application/json') {
        return res.status(415).json({ error: 'Only application/json content type is supported.' });
    }
    next();
});



app.post('/identify', async (req: Request, res: Response) : Promise<any> => {
    const { email, phoneNumber } = req.body;
    const latestContact = await Contact.findOne().sort({ id: -1 });
    const nextId = latestContact ? latestContact.id + 1 : 1;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: 'At least one of email or phoneNumber is required' });
    }

    const existingContacts = await Contact.find({
        $or: [{ email }, { phoneNumber }],
    }).sort({ createdAt: 1 });

    if (existingContacts.length === 0) {
        const newContact = await Contact.create({
        id: nextId,
        email,
        phoneNumber,
        linkedPrecedence: 'primary',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return res.status(200).json({
      contact: {
        primaryContatctId: newContact.id,
        emails: [email].filter(Boolean),
        phoneNumbers: [phoneNumber].filter(Boolean),
        secondaryContactIds: [],
      },
    });
  }

  const primary = existingContacts.find((c) => c.linkedPrecedence === 'primary') || existingContacts[0];

  const emails = new Set<string>();
  const phoneNumbers = new Set<string>();
  const secondaryContactIds: number[] = [];

  for (const contact of existingContacts) {
    if (contact.id !== primary.id) {
      if (contact.linkedPrecedence === 'primary') {
        await Contact.updateOne({ id: contact.id }, {
          linkedPrecedence: 'secondary',
          linkedId: primary.id,
        });
      }
      secondaryContactIds.push(contact.id);
    }
    if (contact.email) emails.add(contact.email);
    if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
  }

  const alreadyKnownEmail = email ? [...emails].includes(email) : true;
  const alreadyKnownPhone = phoneNumber ? [...phoneNumbers].includes(phoneNumber) : true;

  if (!alreadyKnownEmail || !alreadyKnownPhone) {
    const newSecondary = await Contact.create({
      id: nextId,
      email,
      phoneNumber,
      linkedPrecedence: 'secondary',
      linkedId: primary.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    secondaryContactIds.push(newSecondary.id);
    if (email) emails.add(email);
    if (phoneNumber) phoneNumbers.add(phoneNumber);
  }

  // Ensure primary email and phoneNumber are included
  if (primary.email) emails.add(primary.email);
  if (primary.phoneNumber) phoneNumbers.add(primary.phoneNumber);

  return res.status(200).json({
    contact: {
      primaryContatctId: primary.id,
      emails: [primary.email, ...[...emails].filter(e => e !== primary.email)].filter(Boolean),
      phoneNumbers: [primary.phoneNumber, ...[...phoneNumbers].filter(p => p !== primary.phoneNumber)].filter(Boolean),
      secondaryContactIds,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});