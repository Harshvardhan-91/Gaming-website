const router = require('express').Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Get all settings
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    const settings = await Setting.find();
    const formattedSettings = settings.reduce((acc, setting) => {
      acc[setting.category] = setting.settings;
      return acc;
    }, {});
    
    res.json({
      success: true,
      settings: formattedSettings
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching settings' });
  }
});

// Update settings
router.put('/:category', [auth, isAdmin], async (req, res) => {
  try {
    const { category } = req.params;
    const settings = req.body;

    const updatedSettings = await Setting.findOneAndUpdate(
      { category },
      { 
        settings,
        lastUpdatedBy: req.user.userId 
      },
      { 
        new: true,
        upsert: true
      }
    );

    res.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating settings' });
  }
});

module.exports = router;