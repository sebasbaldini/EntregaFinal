import { Router } from "express";
import { __dirname, uploader } from "../utils.js";
import { productModel } from "../Dao/models/Product.model.js";

const router = Router();

// Crear un nuevo producto
router.post('/add', async (req, res) => {
  try {
      console.log('Datos recibidos:', req.body); // Esto debería mostrar los datos enviados

      const { name, description, price, category } = req.body;

      if (!name || !description || !price) {
          return res.status(400).send('Faltan campos obligatorios');
      }

      await ProductDAO.addProduct({ name, description, price, category });

      res.status(201).send('Producto agregado exitosamente');
  } catch (error) {
      console.error('Error al agregar producto:', error);
      res.status(500).send('Error interno del servidor');
  }
});



// Obtener productos con paginación y filtros
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "asc", ...query } = req.query;

    // Validar y normalizar los parámetros
    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);
    if (isNaN(limitNum) || isNaN(pageNum) || limitNum <= 0 || pageNum <= 0) {
      return res.status(400).json({ message: "Parámetros de paginación inválidos" });
    }

    const sortManager = { asc: 1, desc: -1 };
    const products = await productModel.paginate(
      { ...query },
      {
        limit: limitNum,
        page: pageNum,
        sort: { price: sortManager[sort] || 1 },  // Ordenar por precio
        customLabels: { docs: "payload" },
      }
    );

    res.json({ ...products, status: "success" });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


// Obtener producto por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productFinded = await productModel.findById(id);

    if (!productFinded) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({ payload: productFinded });
  } catch (error) {
    console.error("Error al buscar producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Actualizar producto por ID
router.put("/:id", uploader.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Error: archivo faltante" });

    const { id } = req.params;
    const productUpdated = await productModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
        thumbnail: req.file.path.split("public")[1],
      },
      { new: true }
    );

    if (!productUpdated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto actualizado correctamente", payload: productUpdated });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Eliminar producto por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await productModel.findByIdAndDelete(id);

    if (!isDeleted) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente", payload: isDeleted });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
