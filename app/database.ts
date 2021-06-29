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

export class Database {
    private db: Db = undefined;

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
        const res = await this.db.collection<Requirements>('requirements').updateOne(filter, update);
        return req;
    }
}
