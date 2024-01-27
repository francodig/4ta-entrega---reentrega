console.log("Holaaa");

const socket = io();
socket.on("products", (data) => {
  renderProducts(data);
});

//funcion para renderizar Productos

const renderProducts = (products) => {
  const containerProducts = document.getElementById("containerProducts");
  containerProducts.innerHTML = " ";

  products.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        
<p>ID:${item.id}</p>
<p> ${item.title}</p>
<p>Precio: $${item.price}</p>
<button>Eliminar Producto</button>
        `;
    containerProducts.appendChild(card);
    card.querySelector("button").addEventListener("click", () => {
      deleteProduct(item.id);
    });
  });
};
//eliminar Producto
const deleteProduct = (id)=>{
socket.emit("deleteProduct", id)
}
//agregar Producto

document.getElementById("btnEnviar").addEventListener("click",()=>{
    addProduct()
})

const addProduct =()=>{
    const products={
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        image: document.getElementById("image").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === true,
    }
socket.emit("addProduct",products)
}