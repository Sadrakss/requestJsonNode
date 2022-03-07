const express = require("express");
const { request, response } = require("express");
const { randomUUID } = require("crypto");
const fs = require("fs");
const { json } = require("express/lib/response");

const app = express();

app.use(express.json())

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        products = JSON.parse(data);
    }
});

// Body => sempre que eu quiser enviar dados para a minha aplicação
// Params => /products/213903812390213
// Query => /products?id=234848234834&value2342342342

app.post('/products', (request, response) => {

    const { name, price } = request.body;

    const product = {
        name,
        price,
        id: randomUUID(),
    }

    products.push(product)

    productFile()

    return response.json({ message: "Produto cadastrado com sucesso!" })


})

app.get("/products", (request, response) => {
    return response.json(products);
})

app.get("/products/:id", (request, response) => {
    const { id } = request.params;
    const product = products.find((product) => product.id === id);
    return response.json(product);
})

app.put("/products/:id", (request, response) => {
    const { id } = request.params;
    const { name, price } = request.body;

    const productIndex = products.findIndex((product) => product.id === id);
    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    }
    productFile();

    return response.json({ message: "Produto alterado com sucesso" })
})

app.delete("/products/:id", (request, response) => {
    const { id } = request.params;
    const productIndex = products.findIndex((product) => product.id === id);

    products.splice(productIndex, 1);
    productFile();
    return response.json({ message: "Produto removido com sucesso!" })
})

function productFile() {
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("succesfully")
        }
    })
}
app.listen(4002, () => console.log("servidor está rodando na porta 4002"))