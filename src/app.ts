import express from 'express';
import { MongoClient, Db, ObjectId } from 'mongodb';

interface Module {
  name: string;
}

interface Requirement {
  reqid: string,
  text: string
}

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
    return this.db.collection<Module>('modules').find().toArray()
  }

  async add_module(name: string) {
    const doc = { name };
    return this.db.collection<Module>('modules').insertOne(doc).then((result) => {
      return result.ops[0];
    });
  }

  async del_module(id: string) {
    return this.db.collection<Module>('modules').deleteOne({_id: new ObjectId(id)}).then((result) => {
      return result.deletedCount == 1;
    });
  }

  async get_requirements(id: string) {
    const filter = {
      module: `${id}`
    };
    return this.db.collection<Requirement>('requirements').find(filter).toArray()
  }

  async add_requirement(id_module: string, text: string) {
    const doc = {reqid: "", text };
    const result = await this.db.collection<Requirement>('requirements').insertOne(doc);
    console.log(result.ops[0]);
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

// GET /modules
app.get('/modules', async (req, res) => {
  console.log('GET /modules');
  const modules = await database.get_modules();
  res.send(JSON.stringify(modules));
});

// POST /modules {"name": "..."}
app.post('/modules', async (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).send({
    message: "POST /modules : missing name"
  });
  console.log('POST /modules', name);
  let m = await database.add_module(name);
  res.send(JSON.stringify(m));
});

// DELETE /module/<id>
app.delete('/module/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({
    message: "DELETE /modules : missing _id"
  });
  console.log('DELETE /module/<id>', id);
  let deleted = await database.del_module(id);
  res.send(JSON.stringify({deleted}));
});

// GET /module/<ID>/requirements
app.get('/module/:id/requirements', async (req, res) => {
  const id = req.params.id;
  const reqs = await database.get_requirements(id);
  console.log(reqs);
  console.log(JSON.stringify(reqs));
  res.send(JSON.stringify(reqs));
});


// ------------------------------------
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});




