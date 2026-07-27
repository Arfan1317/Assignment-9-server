const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@skillspherecluster.ccixorm.mongodb.net/?retryWrites=true&w=majority&appName=SkillSphereCluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const bookingsCollection = client.db("DocAppointDB").collection("appointments");

app.get('/', (req, res) => {
  res.send('DocAppoint Server is running perfectly on Vercel!');
});

app.get('/bookings/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const query = { userEmail: email };
    const myBookings = await bookingsCollection.find(query).toArray();
    
    res.send({ success: true, data: myBookings });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).send({ success: false, message: "Failed to fetch bookings" });
  }
});

app.post('/bookings', async (req, res) => {
  try {
    const bookingData = req.body;
    const result = await bookingsCollection.insertOne(bookingData);
    
    res.send({ success: true, result });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).send({ success: false, message: "Failed to book appointment" });
  }
});

app.put('/bookings/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const filter = { _id: new ObjectId(id) };
    
    const updateDoc = {
      $set: {
        patientName: updatedData.patientName,
        phone: updatedData.phone,
        date: updatedData.date,
        time: updatedData.time,
      },
    };
    
    const result = await bookingsCollection.updateOne(filter, updateDoc);
    res.send({ success: true, result });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).send({ success: false, message: "Failed to update booking" });
  }
});

app.delete('/bookings/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await bookingsCollection.deleteOne(query);
    
    res.send({ success: true, result });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).send({ success: false, message: "Failed to delete booking" });
  }
});

module.exports = app;