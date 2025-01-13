import fs from 'fs';

class ProductsManager {
    constructor(path) {
        this.path = path;
        this.product = {};
        this.productsList = [];
    }

    async setNewId() {
        const now = await new Date();
        return now.getTime();
    }

    // Funciones para Products
    async getProduct(id) {
        const list = await fs.promises.readFile(this.path, 'utf-8');
        this.productsList = [...JSON.parse(list).products];
        this.productsList.map((prod, i) => {
            if (prod.id == id) {
                this.product = prod;
            }
        });
        return { ...this.product };
    }

    async getAllProducts() {
        try {
            const list = await fs.promises.readFile(this.path, 'utf-8');

            // Verificar si el archivo está vacío o no contiene datos válidos
            if (!list.trim()) {
                console.log("El archivo está vacío o no contiene datos.");
                return []; // Retorna una lista vacía si el archivo está vacío
            }

            const data = JSON.parse(list);  // Parsear el contenido del archivo

            if (!data.products) {
                console.log("El archivo JSON no contiene el campo 'products'.");
                return [];  // Retorna una lista vacía si no tiene el campo 'products'
            }

            // Convertir valores de precio y stock a números
            data.products.forEach(prod => {
                prod.price = parseFloat(prod.price); // Convertir a número
                prod.stock = parseInt(prod.stock);   // Convertir a número
            });

            this.productsList = [...data.products];
            return [...this.productsList];  // Retorna todos los productos
        } catch (error) {
            console.error("Error al leer o analizar el archivo JSON:", error);
            return [];  // Si hay un error, retorna una lista vacía
        }
    }

    async addProduct(product) {
        const newId = await this.setNewId();
        await this.getAllProducts();
        let newProduct = {
            "id": newId,
            "description": "",
            "title": "",
            "code": "",
            "price": 0,
            "status": true,
            "stock": 0,
            "category": ""
        };
        product.description ? newProduct.description = product.description : null;
        product.title ? newProduct.title = product.title : null;
        product.code ? newProduct.code = product.code : null;
        product.price ? newProduct.price = parseFloat(product.price) : null;
        product.status ? newProduct.status = product.status : null;
        product.stock ? newProduct.stock = parseInt(product.stock) : null;
        product.category ? newProduct.category = product.category : null;
        this.productsList.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify({ products: this.productsList }, null, 2));
    }

    async updateProduct(product, id) {
        await this.getAllProducts();
        
        // Convertir el ID a número si es necesario
        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            console.log("ID inválido: El ID debe ser un número válido.");
            return;
        }
    
        console.log("ID recibido para actualizar:", idNumber);
    
        // Verificar si el producto existe en la lista
        const productToUpdate = this.productsList.find(obj => Number(obj.id) === idNumber);
    
        if (!productToUpdate) {
            console.log("Producto no encontrado para actualizar. ID recibido:", idNumber);
            return;
        }
    
        // Actualizar el producto
        if (product.title) productToUpdate.title = product.title;
        if (product.description) productToUpdate.description = product.description;
        if (product.code) productToUpdate.code = product.code;
        if (product.price) productToUpdate.price = product.price;
        if (product.status) productToUpdate.status = product.status;
        if (product.stock) productToUpdate.stock = product.stock;
        if (product.category) productToUpdate.category = product.category;
    
        // Guardar la lista actualizada
        await fs.promises.writeFile(this.path, JSON.stringify({ products: this.productsList }));
        console.log("Producto Modificado");
    }
    
    
    
    async deleteProduct(id) {
        // Validación estricta del ID (confirmamos que es un número y no está vacío)
        if (!id || isNaN(id)) {
            console.log("ID inválido: El ID no puede ser null, undefined, vacío o NaN.");
            return;  // Detenemos la ejecución si el ID no es válido
        }
    
        // Convertir el id a número en caso de que sea un string
        id = Number(id);
    
        // Verificación para asegurarnos de que el id no es NaN
        if (isNaN(id)) {
            console.log("ID inválido: El ID no es un número válido.");
            return; // Detener la ejecución si el ID no es un número
        }
    
        // Obtener todos los productos
        await this.getAllProducts();
    
        // Comprobar si la lista de productos está vacía
        if (this.productsList.length === 0) {
            console.log("No hay productos en el archivo.");
            return;
        }
    
        // Buscar el índice del producto con el ID proporcionado
        const index = this.productsList.findIndex(obj => obj.id === id);
    
        // Verificar si el producto existe en la lista
        if (index !== -1) {
            // Eliminar el producto
            const deletedProduct = this.productsList.splice(index, 1)[0];
    
            try {
                // Escribir la lista actualizada de productos en el archivo
                await fs.promises.writeFile(this.path, JSON.stringify({ products: this.productsList }, null, 2));
                console.log(`Producto eliminado: ${JSON.stringify(deletedProduct)}`);
            } catch (error) {
                console.error("Error al escribir el archivo después de eliminar el producto:", error);
            }
        } else {
            // Si el ID no se encuentra, mostrar el error y no eliminar
            console.log(`ID ${id} no encontrado. No se ha podido eliminar el producto.`);
        }
    }
    
    
    
    
    
}

export default ProductsManager;
