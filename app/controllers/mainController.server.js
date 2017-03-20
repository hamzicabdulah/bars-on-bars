module.exports = function () {
    
    this.get = function (req, res) {
        res.sendFile(process.cwd() + '/public/index.html');    
    };
    
};