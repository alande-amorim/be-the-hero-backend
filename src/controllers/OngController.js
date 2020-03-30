const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async me(request, response) {
    const id = request.headers.authorization;

    const me = await connection('ongs').select('*').where({id}).first();
    if(!me) {
      return response.status(401).json({
        success: false,
        error: 'Operation not allowed'
      });
    }
    me.incidents = await connection('incidents').select('*').where('ong_id', id);

    return response.json(me);
  },

  async index(request, response) {
    const ongs = await connection('ongs').select('*');

    return response.json(ongs);
  },

  async create(request, response) {
    const { name, email, whatsapp, city, uf } = request.body;
    const id = crypto.randomBytes(4).toString('HEX');

    await connection('ongs').insert({
      id, name, email, whatsapp, city, uf
    });

    return response.json({ id });
  }

}
