const fs = require('fs');
const path = require('path');

module.exports = class JsonDB {
  constructor() {
    this.configFilePath = path.join(__dirname, '../../db.json');
    this.ensureDB();
  }

  /**
   * Ensures the JSON database file exists and is valid.
   */
  ensureDB() {
    if (!fs.existsSync(this.configFilePath)) {
      this.writeConfigFile({ licenses: {}, users: {} });
    } else {
      try {
        const data = fs.readFileSync(this.configFilePath, 'utf8');
        JSON.parse(data); 
      } catch (error) {
        console.log('[jsonDb]  Db is corrupted!   Remember, json Db is only meant for Development and not Production!');
        this.writeConfigFile({ licenses: {}, users: {} });
      }
    }
  }

  /**
   * Writes data to the JSON database.
   */
  writeConfigFile(data) {
    fs.writeFileSync(this.configFilePath, JSON.stringify(data, null, 4));
  }

  /**
   * Reads and parses the database file.
   */
  readConfigFile() {
    const data = fs.readFileSync(this.configFilePath, 'utf8');
    return JSON.parse(data);
  }

  /**
   * Adds a new license key.
   */
  addLicense(key, role, expiresAt) {
    const db = this.readConfigFile();
    db.licenses[key] = { role, expiresAt, redeemed: false, redeemedBy: null, redeemedAt: null };
    this.writeConfigFile(db);
  }

  /**
   * Redeems a license key.
   */
  redeemLicense(key, userId) {
    const db = this.readConfigFile();
    if (!db.licenses[key] || db.licenses[key].redeemed) return false; // Invalid or already redeemed

    db.licenses[key].redeemed = true;
    db.licenses[key].redeemedBy = userId;
    db.licenses[key].redeemedAt = new Date().toISOString();

    if (!db.users[userId]) db.users[userId] = { licenses: [], role: null };
    db.users[userId].licenses.push(key);
    db.users[userId].role = db.licenses[key].role;

    this.writeConfigFile(db);
    return true;
  }
};
