const APIkey = '27a78d4369e4cb5dc2ca8a5640545ead';
const rp = require('request-promise');
var movieList=["Rogue One: A Star Wars Story","Split"];// will need to query from DB to get All movie names
const async=require('async');
var MongoClient = require('mongodb').MongoClient;
const imdb = require('imdb-api');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var Mongourl = 'mongodb://localhost:27017/movieInformation';
const MovieDB = require('moviedb')(APIkey);
const userAgentHeader = {
   'User-Agent': 'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/24.0',
   'Content-Type': 'application/x-www-form-urlencoded'
};

//function to get movie information
function getMovieInformation(movieName,callback) {
   var returnVal;

   var options = {
      url: "http://www.omdbapi.com/?t=" + movieName + "&y=&tomatoes=true&plot=shorte&r=json",
      headers: userAgentHeader,
      json: true,
      timeout:3000000
   };
   rp(options)
   .then(function (repos) {
      returnVal = repos;
      imdbID = repos.imdbID;
      options.url = "https://api.themoviedb.org/3/find/" + imdbID + "?api_key=" + APIkey + "&language=en-US&external_source=imdb_id";
      return rp(options);
   }).then(function (repos) {
      MovieDB.movieTrailers({
         id: repos.movie_results[0].id
      }, function (err, res) {
         youtubeURL = "https://www.youtube.com/watch?v=" + res.youtube[0].source;
         returnVal.youtubeURL = youtubeURL;
         callback(returnVal);
      });
   }).catch (function (err) {
      console.log(err);
   });
}

//writing to database
async.each(movieList,
  function(item, callback){
    getMovieInformation(item, function (data){
      
      //console.log(data);
      /*MongoClient.connect(Mongourl,function(err,db){
         assert.equal(null,err);
         db.collection('movieDetails').insertOne(data);
         db.close()
      })
      */
      callback();
    });
  },
  function(err){
    if(err){
      console.log(err);
    }else{
      console.log("finished");
    }
  }
);


/*
getMovieInformation("Rogue One: A Star Wars Story", function(data) {
      console.log(data)
  getMovieInformation("Split", function(data) {
      console.log(data)
  });
});

*/
