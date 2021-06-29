import axios from "axios";
//const axios = require('axios').default;

const url = "http://localhost:3000";

const config = {
    headers: { 'Content-Type': 'application/json' }
}

async function test() {
    /// GET /modules
    await axios.get(`${url}/modules`, config).then((resp) => {
        console.log(resp.data);
    });

    /// POST /modules name=TEST_MODULE
    let idModule = undefined;
    await axios.post(`${url}/modules`, { name: "TEST_MODULE" }, config).then((resp) => {
        console.log(resp.data);
        idModule = resp.data._id;
    });

    /// GET /modules
    await axios.get(`${url}/modules`, config).then((resp) => {
        console.log(resp.data);
    });

    /// GET /module/<ID_MODULE>/requirements
    await axios.get(`${url}/module/${idModule}/requirements`, config).then((resp) => {
        console.log(resp.data);
    });

    /// POST /module/<ID_MODULE>/requirements text=REQ_#1
    let idReq1 = undefined;
    await axios.post(`${url}/module/${idModule}/requirements`, { reqid: "REQ_001", text: "text #1" }, config).then((resp) => {
        console.log(resp.data);
        idReq1 = resp.data._id;
    });

    /// DELETE /module _id: ...
    console.log(`${url}/module/${idModule}`);
    await axios.delete(`${url}/module/${idModule}`, config).then((resp) => {
        console.log(resp.data);
    });

    /// GET /modules
    await axios.get(`${url}/modules`, config).then((resp) => {
        console.log(resp.data);
    });
    
}

test();