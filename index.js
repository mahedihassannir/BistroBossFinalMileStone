const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obla9o6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("bistroDb").collection("menu");

    const reviewCollection = client.db("bistroDb").collection("reviews");

    const cartDb = client.db("cart").collection("Cartcollection")
    const userSDb = client.db("usersREgistrationInfo").collection("regis")





    // gere is teh users registration infos cursor 

    app.get("/users", async (req, res) => {
      const filter = userSDb.find()

      const result = await filter.toArray()
      res.send(result)
    })


    // here is the user register infos

    app.post("/users", async (req, res) => {
      const user = req.body

      console.log(user);

      const query = { email: user.email }



      const existingUser = await userSDb.findOne(query);

      if (existingUser) {
        return res.send({ massage: "user already exist" })
      }


      const result = await userSDb.insertOne(user)
      console.log(result);
      res.send(result)
    })





    // here is the cursor of the cart collection

    app.get("/cart", async (req, res) => {


      const email = req.query.email

      console.log(email);



      if (!email) {

        res.send([]);
      }

      const query = { UserEmail: email };

      const result = await cartDb.find(query).toArray()

      res.send(result)


    })

    // here is the cursor of the cart collection


    // here is the cart collection

    app.post("/cart", async (req, res) => {
      const cart = req.body

      console.log(cart);

      const result = await cartDb.insertOne(cart)
      res.send(result)
    })


    // here is rhe delete system of the product

    app.delete("/cart", async (req, res) => {
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }

      const result = await cartDb.deleteOne(filter)
      
      res.send(result)
    })


    // here is rhe delete system of the product ends


    // here is the cart collection







    app.get('/', async (req, res) => {
    app.get('/', async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    })

    app.post("/menu", async (req, res) => {
      const user = req.body
      console.log(user);

    })

    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('boss is sitting')
})

app.listen(port, () => {
  console.log(`Bistro boss is sitting on port ${port}`);
})




