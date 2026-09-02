// Vercel serverless catch-all: delegates every /api/* request to the Express app.
const app = require('../server');

module.exports = (req, res) => {
    app(req, res);
};
