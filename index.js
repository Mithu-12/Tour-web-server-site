const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.20dfc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
async function run() {
    try {
        // const EventsCollection = client.db("volunteerNetwork").collection("events");
        await client.connect();
        const database = client.db('tour_service');
        const serviceCollection = database.collection('services')
        const cartCollection = database.collection('cart')


        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.json(service);

        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            console.log('hit the post api', service);
            res.json(result);
        
            
        });
  
        // add data to cart collection with additional info
        app.post("/addOrder", async (req, res) => {
            console.log(req.body)
            const cart = req.body;
          const result = await cartCollection.insertOne(cart);
              res.json(result);
              console.log(result);
  
          });
          
          app.get('/orders/', async (req, res) =>  {
              let query = {};
              const email = req.query.email;
              if (email) {
                  query = { email: email}
              }
              const result = await cartCollection.find(query);
              const order =  await result.toArray();
              res.json(order);
          })
          app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) }
            const service = await cartCollection.findOne(query);
            res.json(service);

        })
          app.get('/allOrder/', async (req, res) =>  {
              
              const result = await cartCollection.find({});
              const order =  await result.toArray();
              res.json(order);
              console.log(order);
          })
          //delete cart product
          app.delete('/orders/:id', async (req, res) => {
              const key = req.params.id;
              console.log(key);
                          const query =  { _id: ObjectId(key) };
                          const result = await cartCollection.deleteOne(query);
                          res.json(result)
                          
                         
          })
          app.delete('/allOrder/:id', async (req, res) => {
                        const key = req.params.id;
                        console.log(key);
                        const query =  { _id: ObjectId(key) };
                        const result = await cartCollection.deleteOne(query);
                        res.json(result)
                        
                       
                    })
    }
    
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running')
})
app.listen(port, ()=>{
    console.log('node monmone running on server', port);
})