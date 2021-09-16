import express from "express";
import handlebars from 'express-handlebars'

const app = express();
const PORT = 8080;
const router = express.Router();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use(express.static("public"));

const server = app.listen(PORT, () => {
  console.log("Servidor HTTP escuchando en el puerto", server.address().port);
});
server.on("error", (error) => console.log("Error en servidor", error));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        
    })
);
app.set('views', './views'); 
app.set('view engine', 'hbs');


class Producto {
    constructor(title, price, thumbnail) {
      this.title = title, 
      this.price = price, 
      this.thumbnail = thumbnail;
    }
  }
  const productos = [];

// GEt para ver todos los productos
router.get("/productos/lista", (req, res) => {
  if (productos.length != []) {
    res.status(201).render('main', { listaproductos: productos, listExists: true });
  } else {
    res.status(400).json({
        ok: false,
        msg: 'No hay productos cargados'
     });
  }
});

// GEt para ver productos segun ID
router.get("/productos/lista/:id", (req, res) => {
  let params = req.params;
  console.log(params);
  let id = params.id;
  let produId = productos.find((x) => x.id == id);
  if (produId != undefined) {
    res.json(produId);
  } else {
    res.status(400).json({
        ok: false,
        msg: 'Producto no encontrado'
     });
  }
});

// POST para agregar productos
router.post("/productos/guardar", (req, res) => {
  console.log(req.body);
  const { title, price, thumbnail } = req.body;
    const nuevoProducto = new Producto(title, price, thumbnail);
    if(title && price && thumbnail && nuevoProducto){
        let nuevoId = productos.length + 1;
        while (productos.find((x) => x.id === nuevoId)) {
          nuevoId++;
        }
        nuevoProducto.id = nuevoId;
        productos.push(nuevoProducto);
        console.log(`post request a api/productos/guardar con producto`);
        console.log(nuevoProducto);
        res.status(201).json({
            ok: true,
            msg: `Nuevo producto agregado`,
            producto: nuevoProducto
        });
        
    } else {
        res.status(400).json({
            ok: false,
            msg: 'Complete todos los datos'
         });
      }
});

// DELETE para borrar productos
router.delete("/productos/borrar/:title", (req, res) => {
    let params = req.params;
    let title = params.title;
    let produId = productos.find((x) => x.title == title);
    console.log(produId);
    if (produId != undefined) {
        let delet = productos.splice(title-1,1)
        res.status(201).json({
            ok: true,
            msg: `producto eliminado ${delet}`
        })
    } else {
      res.status(400).json({
          ok: false,
          msg: 'No se puedo eliminat producto'
       });
    }
  });

  

