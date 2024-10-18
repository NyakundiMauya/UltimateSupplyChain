import Asset from '../models/assets.js';

export const createAsset = async (req, res) => {
  const { type, title, serialNumber, dateLoaned, dateReturned, departmentLoanedTo } = req.body;

  try {
    const newAsset = new Asset({ type, title, serialNumber, dateLoaned, dateReturned, departmentLoanedTo });
    await newAsset.save();
    res.status(201).json(newAsset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssetById = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedAsset = await Asset.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedAsset) return res.status(404).json({ message: 'Asset not found' });
    res.status(200).json(updatedAsset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAsset = await Asset.findByIdAndDelete(id);
    if (!deletedAsset) return res.status(404).json({ message: 'Asset not found' });
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
