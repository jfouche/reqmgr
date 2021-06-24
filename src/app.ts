import express from 'express';
import { MongoClient, Db } from 'mongodb';

class Database {
  private db: Db;

  constructor(password: string) {
    const uri = `mongodb+srv://admin:${password}@cluster0.md14o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    const client = new MongoClient(uri, options);
    client.connect((err, client) => {
      if (err) throw err;

      console.log('Connected to database')
      this.db = client.db('reqmgr');
    });
  }

  async get_modules() {
    return this.db.collection('modules').find().toArray()
  }

  async add_module(name: string) {
    const module = { name };
    const result = await this.db.collection('modules').insertOne(module);
    console.log(result);
  }
}


// Mongodb connection
const password = process.argv[2];
const database = new Database(password);

// Express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 3000;

app.get('/', async (req, res) => {
  const modules = await database.get_modules();
  console.log(modules);
  res.send('The sedulous hyena ate the antelope!');
  // db.collection('modules').find().toArray().then(m => {
  //   console.log(m);
  // });
});

app.post('/modules', async (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).send({
    message: "POST /modules : missing name"
  });
  database.add_module(name);
  res.send('New post added');
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});




