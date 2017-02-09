const APIkey = '27a78d4369e4cb5dc2ca8a5640545ead';
const rp = require('request-promise');
const MovieDB = require('moviedb')(APIkey);
const userAgentHeader = {
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
	'Content-Type': 'application/x-www-form-urlencoded'
};

//(to get image poster)https://image.tmdb.org/t/p/w640/<poster_path>
// to get youtube link https://www.youtube.com/watch?v=<key>


function getMovieInformation(movieName, year) {
	var returnVal;
	var options = {
		url: "http://www.omdbapi.com/?t=" + movieName + "&y=" + year + "&plot=short&tomatoes=true&r=json",
		headers: userAgentHeader,
		json: true
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
/*
function getYoutubeTrailer(imdbID) {
	var youtubeURL;
	var options = {
		url: "https://api.themoviedb.org/3/find/" + imdbID + "?api_key=" + APIkey + "&language=en-US&external_source=imdb_id",
		headers: userAgentHeader,
		json: true

	};

	return rp(options)
	.then(function (repos) {
		MovieDB.movieTrailers({
			id: repos.movie_results[0].id
		}, function (err, res) {
			youtubeURL = "https://www.youtube.com/watch?v=" + res.youtube[0].source;
			return youtubeURL;
		});
	});

}*/
getMovieInformation("Split", "2016");
