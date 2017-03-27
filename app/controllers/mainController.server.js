'use strict';

var Yelp = require('yelp');
var User = require('../models/users');
var Place = require('../models/places.js');

module.exports = function () {
    
    var yelp = new Yelp({
        consumer_key: process.env.YELP_CONSUMER_KEY,
        consumer_secret: process.env.YELP_CONSUMER_SECRET,
        token: process.env.YELP_TOKEN,
        token_secret: process.env.YELP_TOKEN_SECRET
    });
    
    this.get = function (req, res) {
        yelp.search({location: req.params.location})
        .then(function (data) {
            var data = data.businesses.map(function (item) {
                return {
                    //Get only the necessary properties of the objects
                    name: item.name,
                    url: item.url,
                    rating: item.rating,
                    image_url: item.image_url || 'https://www.farmingdale.edu/rambassadors/image/no-image-available.jpg',
                    snippet: item.snippet_text,
                    address: item.location.display_address[0],
                    /*The going property is automatically set to the value of an empty array, but is updated
                    if the place is already in the database with the forEach method*/
                    going: 0
                };
            });
            var counter = 0;
            data.forEach(function (item) {
                //Update the going property of the place if the place is already in the database
                Place.findOne({name: item.name}, {'_id': false})
                .exec(function (err, result) {
                    if (err) throw err;
                    if (result) item.going = result.going.length;
                    counter++;
                    if (counter === data.length - 1) res.send(data);
                }); 
            });
        
        })
        .catch(function (err) {
            console.error(err);
        });
    };
    
    this.addToGoingList = function (req, res) {
        if (!req.isAuthenticated()) {
            res.send({redirect: '/auth/twitter'});
        } else {
            Place.findOne({name: req.params.place})
            .exec(function (err, result) {
                if (err) throw err;
                /*If the place is already in the database, add/remove the user to/from its going array property;
                  else add the place to the database first, and then add the user to its going array property*/
                if (result) {
                    if (result.going.indexOf(req.user.twitterId) < 0) {
                        Place.findOneAndUpdate({name: req.params.place}, {$push: {going: req.user.twitterId}}, {new: true})
                        .exec(function (err, result) {
                            if (err) throw err;
                            res.send(result);
                        });
                    } else {
                        Place.findOneAndUpdate({name: req.params.place}, {$pull: {going: req.user.twitterId}}, {new: true})
                        .exec(function (err, result) {
                            if (err) throw err;
                            res.send(result);
                        });
                    }
                } else {
                    var newDoc = new Place({
                        name: req.params.place,
                        going: [req.user.twitterId]
                    });
                    newDoc.save(function (err, result) {
                        if (err) throw err;
                        res.send(result);
                    });    
                }
            });
        }
    };
    
    this.setLocation = function (req, res, next) {
        /*If the user is authenticated, add the searched location as their default location, 
        so that it can be automatically searched for when the user next logs in*/
        if (req.isAuthenticated()) {
            User.findOneAndUpdate({'twitterId': req.user.twitterId}, {'location': req.params.location})
            .exec(function (err, result) {
                if (err) throw err;
            });
        }
        return next();
    };
    
    this.getUserDefaultLoc = function (req, res) {
        //Get user's default location if user is authenticated
        if (req.isAuthenticated()) {
            User.findOne({'twitterId': req.user.twitterId})
            .exec(function (err, result) {
                if (err) throw err;
                if (result) {
                    res.send({location: result.location});
                }
            });
        } else {
            res.send({location: ''});
        }
    };
    
};