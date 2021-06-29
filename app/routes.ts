import {Express} from 'express';
import {Database} from './database'

export function init_routes(app: Express, database: Database) {

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
}
