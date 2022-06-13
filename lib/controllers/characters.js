const { Router } = require('express');
const { Character } = require('./models/Character');
const { Quote } = require('./models/Quote');

module.exports = Router()
  .post('/characters', async (req, res, next) => {
    try {
      const character = await Character.insert(req.body);
      if (req.body.quotes) {
        await Promise.all(
          req.body.quotes.map(async (quote) => {
            await Quote.insert(quote, character.id);
          }
          )
        );
        res.json(character);
        
      }
    } catch (err) {
      next(err);
    }
  })
  .get('/', async (req, res) => {
    const characters = await Character.getAll();
    const respData = characters.map((character) => {
      return {
        id: character.id,
        name: `${character.first_name} ${character.last_name}`,
        quotes: character.quotes.map((quote) => quote.detail),
      };
    }
    );
    res.json(respData);
  }
  );



