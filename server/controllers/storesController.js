import Store from '../models/Stores.js';

const storesController = {
  // Create a new store
  createStore: async (req, res) => {
    try {
      const newStore = new Store(req.body);
      const savedStore = await newStore.save();
      res.status(201).json(savedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all stores
  getAllStores: async (req, res) => {
    try {
      const stores = await Store.find();
      res.status(200).json(stores);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a specific store by ID
  getStoreById: async (req, res) => {
    try {
      const store = await Store.findById(req.params.id);
      if (!store) return res.status(404).json({ message: 'Store not found' });
      res.status(200).json(store);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a store
  updateStore: async (req, res) => {
    try {
      const updatedStore = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedStore) return res.status(404).json({ message: 'Store not found' });
      res.status(200).json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a store
  deleteStore: async (req, res) => {
    try {
      const deletedStore = await Store.findByIdAndDelete(req.params.id);
      if (!deletedStore) return res.status(404).json({ message: 'Store not found' });
      res.status(200).json({ message: 'Store deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default storesController;
