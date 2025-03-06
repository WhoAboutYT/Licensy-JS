/**
 * Generates a key and provides a key in type string.
 * @returns {String} key
 */
function KeyGen() {
  const groups = 5;
  const groupLength = 5;

  const allowedChars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const keyParts = [];

  for (let i = 0; i < groups; i++) {
    let group = '';
    for (let j = 0; j < groupLength; j++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      group += allowedChars[randomIndex];
    }
    keyParts.push(group);
  }
  return keyParts.join('-');
};

module.exports = KeyGen;