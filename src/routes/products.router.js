const express =require("express")
const router =  express.Router()
const fs = require('fs').promises;
const ProductManager = require("../controllers/productManager.js")
const productManager =new ProductManager("./src/models/products.json")

//Router

//Agregar Productos
router.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;
    
     const existingProduct = await productManager.getProductsById(newProduct.id);
     if (existingProduct) {
   
       return res.status(400).json({ status: "error", message: "El ID del producto ya existe" });
     }
     await productManager.addProduct(newProduct);
    res.json({ status: "success", message: "Producto Creado" });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});

  
  // Ruta para actualizar un producto por su ID
  router.put("/products/:pid", async (req, res) => {
    try {
      const productIdToUpdate = parseInt(req.params.pid);
      const updatedProductData = req.body;
      await productManager.upDateProducts(productIdToUpdate, updatedProductData);
      res.json({ status: "success", message: "Producto Actualizado" });
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
  });
  


 //Ruta DELETE para eliminar un producto por ID
router.delete("/products/:pid", async (req, res) => {
  try {
    const productIdToDelete = parseInt(req.params.pid) ;
    const existingProduct = await productManager.getProductsById(productIdToDelete);

    if (!existingProduct) {

      return res.status(404).json({ status: "error", message: "El Producto no existe" });
    }


    await productManager.deleteProduct(productIdToDelete);
    res.json({ status: "success", message: "Producto Eliminado" });

  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});




  //Limit
  
  router.get("/products", async (req, res) => {
    try {
    const fileContent = await fs.readFile('./src/models/products.json', 'utf-8');
      
      // Parsea el contenido del archivo a un array
      const myProducts = JSON.parse(fileContent);
  
      const limit = parseInt(req.query.limit);
  
      if (!isNaN(limit) && limit > 0) {
        // Si se proporciona un límite válido, devuelve los productos limitados
        const productos = myProducts.slice(0, limit);
        res.send(productos);
      } else {
        // Si no se proporciona un límite válido, devuelve todos los productos
        res.send(myProducts);
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.send("Error interno del servidor");
    }
  });
  
  
  
  
  
  //busqueda por id
  
  const filePath = './src/models/products.json';
  
  router.get("/products/:id", async (req, res) => {
    try {
      const idToFind = parseInt(req.params.id);
      
      if (isNaN(idToFind) || idToFind <= 0) {
        return res.status(400).json({ error: "ID de producto no válido" });
      }
  
      // Lee el contenido del archivo de productos
      const fileContent = await fs.readFile(filePath, 'utf-8');
  
      // Parseo el archivo a un array de productos
      const products = JSON.parse(fileContent);
  
      // Busca el producto por ID
      const foundProduct = products.find(product => product.id === idToFind);
  
      if (foundProduct) {
        res.json(foundProduct);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  module.exports= router;