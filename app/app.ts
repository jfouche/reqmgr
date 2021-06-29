import express from 'express';
import {Database} from './database'
import {init_routes} from './routes'
import * as readline from 'readline'

const port = 3000;

async function get_password() {
  let password = process.argv[2];
  if (!password) {
    console.log('Enter database pasword')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const it = rl[Symbol.asyncIterator]();
    password = (await it.next()).value;
  }
  return password
}

get_password().then((password) => {
  const database = new Database(password);

  // Express
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  init_routes(app, database);
  app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
  });
});


