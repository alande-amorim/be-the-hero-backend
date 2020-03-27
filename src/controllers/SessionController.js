const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { id } = request.body;

    const me = await connection('ongs').select('*').where({id}).first();
    if(!me) {
      return response.status(404).json({
        'error': 'Resource not found'
      });
    }

    return response.json({ id });
  }
}
