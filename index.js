const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@skillspherecluster.ccixorm.mongodb.net/?appName=SkillSphereCluster`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
    
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    
    const db = client.db("docAppointDB");
    const usersCollection = db.collection("users");
    const appointmentsCollection = db.collection("appointments");

   
    app.get('/', (req, res) => {
      res.send('DocAppoint Server is running smoothly!');
    });

  } finally {
    
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`DocAppoint Server is listening on port ${port}`);
});
module.exports = app;