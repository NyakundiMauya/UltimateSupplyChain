import express from 'express';
import storesController from '../controllers/storesController.js';

const router = express.Router();

// Create a new store
router.post('/', storesController.createStore);

// Get all stores
router.get('/', storesController.getAllStores);

// Get a specific store by ID
router.get('/:id', storesController.getStoreById);

// Update a store
router.put('/:id', storesController.updateStore);

// Delete a store
router.delete('/:id', storesController.deleteStore);

export default router;
