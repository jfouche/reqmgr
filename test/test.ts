import axios from "axios";
//const axios = require('axios').default;

const url = "http://localhost:3000";

const config = {
    headers: { 'Content-Type': 'application/json' }
}

async function test() {
    /// GET /modules
    await axios.get(`${url}/modules`, config).then((response) => {
        console.log(response.data);
    });

    /// POST /modules name: TEST_MODULE
    let idModule = undefined;
    let params = { name: "TEST_MODULE" };
    await axios.post(`${url}/modules`, params, config).then((response) => {
        console.log(response.data);
        idModule = response.data._id;
    });

    /// GET /modules
    await axios.get(`${url}/modules`, config).then((response) => {
        console.log(response.data);
    });

    /// DELETE /module _id: ...
    console.log(`${url}/module/${idModule}`);
    await axios.delete(`${url}/module/${idModule}`, config).then((response) => {
        console.log(response.data);
    });

    /// GET /modules
    await axios.get(`${url}/modules`, config).then((response) => {
        console.log(response.data);
    });

}

test();