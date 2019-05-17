require("dotenv").config();

var axios = require("axios");
var keys = require("./keys.js");

function fetch(url, operation){
    
    axios
        .get(url)
        .then(function(response) {
        var responses = response.data;
        if (operation === "concert"){
            printConcert(response.data);
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
    api_call ="https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
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



switch(process.argv[2]){
    case "concert-this" :
        console.log("concert-this");
        concert(process.argv[3]);
        break;
    
    case "spotify-this-song" :
        console.log("spotify-this-song");
        break;
    
    case "movie-this" :
        console.log("movie-this");
        break;
    
    case "do-what-it-says" :
        console.log("do-what-it-says");
        break;
        
    default:
        console.log("Must enter a command.");
        break;
}
