const express = require("express");
const app =express()
const fs = require('fs').promises;
const PORT = 8080;
const socket = require("socket.io")
const productsRouter = require("./routes/products.router.js");
const cartsRouter =require("./routes/carts.router.js")
const viewRouter = require("./routes/views.router.js")



//handlebars

const exphbs= require("express-handlebars");


app.engine("handlebars", exphbs.engine())
app.set("view engine","handlebars")
app.set("views", "./src/views")


//Middelware
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("./src/public"))


//Routes
app.use("/api", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewRouter)


//INICIO EL SERVIDOR

 const server=app.listen(PORT, ()=>{
  console.log(`Escuchando en http://localhost:${PORT}`);
})

const ProductManager = require("./controllers/productManager.js")
const productManager= new ProductManager("./src/models/products.json")

const io =socket(server)

io.on("connection",async(socket)=>{
  console.log("un cliente se conecto");

  socket.emit("products", await productManager.getProducts())

  socket.on("deleteProduct",async(id)=>{
    await productManager.deleteProduct(id)
    io.sockets.emit("products", await productManager.getProducts())
  })
  //recibimos el evento de agregar productos
  socket.on("addProduct",async(product)=>{
    await productManager.addProduct(product)
    io.sockets.emit("products", await productManager.getProducts())
  })
})















