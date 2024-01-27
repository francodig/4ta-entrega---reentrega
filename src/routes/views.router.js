const express = require("express")
const router = express.Router()
const fs = require('fs').promises;
const ProductManager = require("../controllers/productManager.js")
const productManager= new ProductManager("./src/models/products.json")


  router.get("/realtimeProducts",async (req,res)=>{
    res.render("realtimeProducts", {title:"realtimeProducts "})
  })


  
router.get("/", async (req, res) => {
    try {
  const products = await productManager.getProducts()
 //const fileContent = await fs.readFile('./src/models/products.json', 'utf-8');
      
      // Parsea el contenido del archivo a un array
      //const products = JSON.parse(fileContent);
      res.render("index",{products: products})
  
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.send("Error interno del servidor");
    }
  });
 module.exports = router;