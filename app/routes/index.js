var mainController = require(process.cwd() + '/app/controllers/mainController.server.js');

module.exports = function (app) {
    
    var MainController = new mainController();
    
    app.route('/')
    .get(MainController.get); 
    
};