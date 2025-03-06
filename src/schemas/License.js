const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    // Mongoose makes a ID itself, but this dosen't look like a "license"

    licenseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // The User who Generated the key (For future Trackdown Purposes)
    // Will most likely stay DB only feature

    userCreating: {
      type: String,
      required: true,
    },

    // User who redeemed
    // Possible future command to lookup who redeemed which key.

    redeemingUser: {
      userId: String,
      required: false,
    },

    // Information about Key
    // So when they redeem it, the bot knows what to give to the user

    licenseInfos: {
      roleId: String,
      expiry: {
        type: Date,
        required: true,
      },
    },

    // redeemingUser can also be used for this, but it's easier to just have a status symbol on it.

    status: {
      type: String,
      enum: ['active', 'redeemed', 'expired'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

schema.index({ 'licenseInfos.expiry': 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('License', schema);
