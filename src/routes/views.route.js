import { ProductManager } from '../Dao/Product.js';
import { chatModel } from '../Dao/models/Chat.model.js';
import { productModel } from '../Dao/models/Product.model.js';
import { socketServer } from '../app.js';
import { __dirname } from '../utils.js';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productModel.find().lean();  // Usamos .lean() para obtener objetos planos
        res.render('index', { list: products });  // Renderizamos la vista con los productos de la base de datos
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send('Error al obtener productos');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productModel.find().lean();  // Usamos .lean() para obtener objetos planos
        res.render('realTimeProducts', { list: products });  // Renderizamos la vista con los productos de la base de datos
    } catch (error) {
        console.error("Error al obtener productos en tiempo real:", error);
        res.status(500).send('Error al obtener productos');
    }
});


router.get('/chats', async (req, res) => {
    try {
        const results = await chatModel.find().lean();
        res.render('chats', { messagesContainer: [...results] });
    } catch (error) {
        console.error("Error al obtener mensajes del chat:", error);
        res.status(500).send('Error al obtener mensajes');
    }
});

export default router;