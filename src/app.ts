import express from 'express';
import { MongoClient, Db, ObjectId } from 'mongodb';

interface Module {
  name: string;
}

interface Requirements {
  reqs: Requirement[];
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
    return this.db.collection<Module>('modules').insertOne(doc).then(async (result) => {
      const id = result.ops[0]._id;
      await this.db.collection<Requirements>('requirements').insertOne({ _id: id, reqs: [] });
      return result.ops[0];
    });
  }

  async del_module(id: string) {
    const oid = new ObjectId(id) 
    return this.db.collection<Module>('modules').deleteOne({ _id: oid }).then(async (result) => {
      if (result.deletedCount != 1) return false;
      result = await this.db.collection<Requirements>('requirements').deleteOne({ _id: oid });
      return result.deletedCount == 1;
    });
  }

  async get_requirements(id_module: string) {
    const filter = {
      module: new ObjectId(id_module)
    };
    return this.db.collection<Requirements>('requirements').find(filter).toArray()
  }

  async add_requirement(id_module: string, reqid: string, text: string) {
    const filter = {
      _id: new ObjectId(id_module)
    };
    const req = {
      _id: new ObjectId(),
      reqid,
      text
    }
    const update = {
      $push: {
        reqs: req
      }
    };
    console.log(filter);
    console.log(update);
    const res = await this.db.collection<Requirements>('requirements').updateOne(filter, update);
    
    console.log(res);
    return req;
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
  res.send(JSON.stringify({ deleted }));
});

// GET /module/<ID>/requirements
app.get('/module/:id/requirements', async (req, res) => {
  const id_module = req.params.id;
  console.log(`GET /module/${id_module}/requirements`);
  const reqs = await database.get_requirements(id_module);
  res.send(JSON.stringify(reqs));
});


// POST /module/<ID>/requirements text="..." reqid="..."
app.post('/module/:id/requirements', async (req, res) => {
  const moduleId = req.params.id;
  const reqid = req.body.reqid;
  const text = req.body.text;
  console.log(`POST /module/${moduleId}/requirements`, reqid, text);
  const reqs = await database.add_requirement(moduleId, reqid, text);
  res.send(JSON.stringify(reqs));
});


// ------------------------------------
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});




