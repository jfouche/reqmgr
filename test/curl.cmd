curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:3000/modules

curl -d "{}" -H "Content-Type: application/json" -X POST http://localhost:3000/modules
curl -d "{ \"name\" : \"SSDD\" }" -H "Content-Type: application/json" -X POST http://localhost:3000/modules

curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:3000/module:<ID>/requirements

