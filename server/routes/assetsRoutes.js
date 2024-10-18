// routes/assetRoutes.js
import express from 'express';
import { createAsset, getAllAssets, getAssetById, updateAsset, deleteAsset } from '../controllers/assetsController.js';

const router = express.Router();

// Get all assets
router.get('/', getAllAssets);

// Create a new asset
router.post('/', createAsset);

// Get a single asset by ID
router.get('/:id', getAssetById);

// Update an asset
router.put('/:id', updateAsset);

// Delete an asset
router.delete('/:id', deleteAsset);

export default router;
