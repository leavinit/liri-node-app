require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");

function fetch(url, operation){
    axios
        .get(url)
        .then(function(response) {
            if (operation === "concert"){
                printConcert(response.data);
            }
            if (operation === "movie"){
                printMovie(response.data);
            }
            
        })
        .catch(function(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
        console.log(error.config);
        });
}

function concert(artist){
    var artist = artist;
    var api_call ="https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    console.log(api_call);
    fetch(api_call,"concert");
}
function printConcert(feedJson){
    feedJson.forEach(function(item){
        console.log(item.venue.name);
        console.log(item.venue.city);
        console.log(item.venue.country);
        console.log(item.datetime);
    });
} 

function song(songName){
    var songName = songName;
    spotify.search({ type: 'track', query: songName }, function(error, data) {
        if (error) {
          return console.log('Error!: ' + error);
        }
        console.log(data.tracks.items[0].album.artists[0].name);
        console.log(data.tracks.items[0].name);
        console.log(data.tracks.items[0].album.name);
        console.log(data.tracks.items[0].preview_url);

      });
}

function movie(movieName){
    var movieName = movieName;
    var api_call = "http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=trilogy"
    console.log(api_call);
    fetch(api_call,"movie")
}
function printMovie(feedJson){
    console.log(feedJson.Title);
    console.log(feedJson.Year);
    console.log(feedJson.Ratings[0]);
    console.log(feedJson.Ratings[1]);
    console.log(feedJson.Country);
    console.log(feedJson.Language);
    console.log(feedJson.Plot);
    console.log(feedJson.Actors);

}
/////////////////////////////////////////////MAIN ENTRY POINT
switch(process.argv[2]){
    case "concert-this" :
        console.log("concert-this");
        concert(process.argv[3]);
        break;
    
    case "spotify-this-song" :
        console.log("spotify-this-song");
        song(process.argv[3]);
        break;
    
    case "movie-this" :
        console.log("movie-this");
        movie(process.argv[3]);
        break;
    
    case "do-what-it-says" :
        console.log("do-what-it-says");
        break;
        
    default:
        console.log("Must enter a command.");
        break;
}
