// models/associations.js
const Actor = require('./Actor');
const Tag = require('./Tag');

// Actor can have multiple tags, and a tag can belong to multiple actors
Actor.belongsToMany(Tag, { through: 'Actor_Tags', foreignKey: 'actorId' });
Tag.belongsToMany(Actor, { through: 'Actor_Tags', foreignKey: 'tagId' });
