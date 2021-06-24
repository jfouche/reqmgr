import express from 'express';
import { MongoClient } from 'mongodb';

// Mongodb connection
const password = process.argv[2];
const uri = `mongodb+srv://admin:${password}@cluster0.md14o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const client = new MongoClient(uri, options);
client.connect((err, client) => {
  if (err) return console.error(err);

  console.log('Connected to database')

  // Express
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const port = 3000;

  app.get('/', (req, res) => {
    res.send('The sedulous hyena ate the antelope!');
  });

  app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
  });
});

