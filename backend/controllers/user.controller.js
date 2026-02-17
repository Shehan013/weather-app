const { UserPreferences } = require('../models');

exports.getPreferences = async (req, res, next) => {
  try {
    const { key } = req.params;
    const userId = req.user.id;

    const preference = await UserPreferences.findOne({
      where: {
        user_id: userId,
        preference_key: key
      }
    });

    if (!preference) {
      return res.json({
        success: true,
        data: null,
        message: 'No preferences found'
      });
    }

    res.json({
      success: true,
      data: preference.preference_value
    });
  } catch (error) {
    console.error('Error in getPreferences:', error);
    next(error);
  }
};

exports.savePreferences = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    const userId = req.user.id;

    if (!key || !value) {
      return res.status(400).json({
        success: false,
        error: 'Both key and value are required'
      });
    }

    const [preference, created] = await UserPreferences.upsert({
      user_id: userId,
      preference_key: key,
      preference_value: value
    });

    res.json({
      success: true,
      data: preference,
      message: created ? 'Preferences created' : 'Preferences updated'
    });
  } catch (error) {
    console.error('Error in savePreferences:', error);
    next(error);
  }
};

exports.getAllPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const preferences = await UserPreferences.findAll({
      where: { user_id: userId }
    });

    res.json({
      success: true,
      count: preferences.length,
      data: preferences
    });
  } catch (error) {
    console.error('Error in getAllPreferences:', error);
    next(error);
  }
};