const APIkey = '27a78d4369e4cb5dc2ca8a5640545ead';
const rp = require('request-promise');
const async = require('async');
const MovieDB = require('moviedb')(APIkey);
const userAgentHeader = {
	'User-Agent': 'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/24.0',
	'Content-Type': 'application/x-www-form-urlencoded'
};

//(to get image poster)https://image.tmdb.org/t/p/w640/<poster_path>
// to get youtube link https://www.youtube.com/watch?v=<key>

var returnVal;
function getMovieInformation(movieName, year) {
	
	var options = {
		url: "http://www.omdbapi.com/?t=" + movieName + "&y=" + year + "&tomatoes=true&plot=shorte&r=json",
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
			console.dir(returnVal, {
				depth: 3
			});
			return returnVal;
		});
	}).catch (function (err) {
		console.log(err);
	});

}


