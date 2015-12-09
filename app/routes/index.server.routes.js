module.exports = function(app) {
	// Use the index controllers render method
    var index = require('../controllers/index.server.controller');
    app.get('/', index.render);
};