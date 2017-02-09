var APIkey='27a78d4369e4cb5dc2ca8a5640545ead'
var MovieDB = require('moviedb')(APIkey);
var movie = require('node-movie');
var rp = require('request-promise');

getMovieInformation("Split", "2016")


//(to get image poster)https://image.tmdb.org/t/p/w640/<poster_path>
// to get youtube link https://www.youtube.com/watch?v=<key> 


function getMovieInformation(movieName, year){
   var a;
   var b="b";
   var options ={
      url: "http://www.omdbapi.com/?t="+movieName+"&y="+year+"&plot=short&tomatoes=true&r=json",
      headers: { 
         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
         'Content-Type' : 'application/x-www-form-urlencoded' 
      },
      json:true
   };

   rp(options)
      .then(function(repos){
         a= getYoutubeTrailer(repos.imdbID);
         
      })

      a.then(function(resultA){
         console.log(resultA)
      })

}

function getYoutubeTrailer(imdbID){
   var youtubeURL;
   var options={
      url : "https://api.themoviedb.org/3/find/"+imdbID+"?api_key="+APIkey+"&language=en-US&external_source=imdb_id",
      headers: { 
         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
         'Content-Type' : 'application/x-www-form-urlencoded' 
      },
      json:true

   };

   rp(options)
      .then(function(repos){
         MovieDB.movieTrailers({id: repos.movie_results[0].id}, function(err, res){
              //console.log(res.youtube[0].source);
               youtubeURL="https://www.youtube.com/watch?v="+res.youtube[0].source; 
               //console.log(youtubeURL)
               return youtubeURL;
         });
      })
      
}




