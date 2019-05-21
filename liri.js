require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var os = require("os");
var moment = require("moment");
moment().format();


// var option;

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
    artist = artist.replace(/['"]+/g, '');
    var api_call ="https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    // console.log(api_call);
    fetch(api_call,"concert");
}
function printConcert(feedJson){
    var to_log = "Data Returned:"+os.EOL+os.EOL;
    feedJson.forEach(function(item){
        console.log(item.venue.name);
        to_log += item.venue.name +os.EOL;
        console.log(item.venue.city);
        to_log += (item.venue.city)+", ";
        console.log(item.venue.country);
        to_log += (item.venue.country)+os.EOL;
        var temp=moment(item.datetime).format("MM/DD/YYYY");
        console.log(temp+os.EOL);
        // console.log(item.datetime);

        to_log += temp+os.EOL+os.EOL;
    });
    // console.log("sending this to log: "+ to_log);
    logger(to_log);
} 

function song(songName){
    var songName = songName;
    
    var to_log = "Data Returned:"+os.EOL+os.EOL;
    spotify.search({ type: 'track', query: songName }, function(error, data) {
        if (error) {
          return console.log('Error!: ' + error);
        }
        console.log(data.tracks.items.length+ " tracks found."+os.EOL);
        data.tracks.items.forEach(function(thisTrack){
            console.log(thisTrack.album.artists[0].name);
            to_log += thisTrack.album.artists[0].name + os.EOL;
            console.log(thisTrack.name);
            to_log += thisTrack.name + os.EOL;
            console.log(thisTrack.album.name);
            to_log += thisTrack.album.name + os.EOL;
            console.log(data.tracks.items[0].preview_url+os.EOL);
            to_log += thisTrack.preview_url + os.EOL+ os.EOL;
        })
        
        logger(to_log);
      });
      
}

function movie(movieName){
    var movieName = movieName;

    var api_call = "http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=trilogy"
    console.log(api_call);
    fetch(api_call,"movie")
}
function printMovie(feedJson){
    var to_log = "Data Returned:"+os.EOL+os.EOL;
    console.log(feedJson.Title);
    to_log+= feedJson.Title + os.EOL;
    console.log(feedJson.Year);
    to_log+= feedJson.Year + os.EOL;
    console.log(feedJson.Ratings[0]);
    to_log+= JSON.stringify(feedJson.Ratings[0]) + os.EOL;
    console.log(feedJson.Ratings[1]);
    to_log+= JSON.stringify(feedJson.Ratings[1]) + os.EOL;
    console.log(feedJson.Country);
    to_log+= feedJson.Country + os.EOL;
    console.log(feedJson.Language);
    to_log+= feedJson.Language + os.EOL;
    console.log(feedJson.Plot);
    to_log+= feedJson.Plot + os.EOL;
    console.log(feedJson.Actors);
    to_log+= feedJson.Actors + os.EOL;
    logger(to_log);
}

function sayWhatToDo(){
    var to_log = "---Next Command Generated From random.txt---"+os.EOL;
    logger(to_log);
    var newOpt;
    var newArg;
    fs.readFile("./random.txt", "utf-8", function(error,data) {

        if (error) {
        console.log(error);
        }
        else {
            var ct = 0;
            temp0=data.split("\r\n")
            var randNum = Math.floor(Math.random()*temp0.length);
            // console.log(randNum);
            temp0.forEach(function(line){
                temp1=line.split(",");
                // console.log(temp1[0]);
                // console.log(temp1[1]);
                if (ct==randNum){
                    newOpt=temp1[0]
                    newArg=temp1[1];
                }
                ct++;
            });                
            // console.log(newOpt+ ":newopt< newarg>:" + newArg);
            mainMenu(newOpt,newArg);
            
        }
    });
}


function logger(msgIn){
    var dt = new Date();
    var utcDate = dt.toUTCString();
    var metaData = utcDate + " "+ msgIn + os.EOL;
    fs.appendFile("log.txt", metaData, function(err) {
        // error case
        if (err) {
          console.log(err);
        }
        //let the user know you saved data
        else {
          console.log("---logged---");
        }
      });
      
}


/////////////////////////////////////////////MAIN ENTRY POINT
mainMenu();
function mainMenu(optionIn, argumentIn){
    if(optionIn){
        var option = optionIn;
        var argument = argumentIn;
    }
    else { 
        option = process.argv[2];
        var argument = process.argv[3];
    }
    switch(option){
        case "concert-this" :
            // console.log("concert-this");
            logger("Command: concert-this " + argument);
            concert(argument);
            break;
        
        case "spotify-this-song" :
            console.log("spotify-this-song");
            // console.log("arg: " + argument)
            if (!argument){
                console.log("---NO SONG SELECTED? Really?---");
                argument = "The Sign Ace of Base";
            }
            logger("Command: spotify-this-song " + argument);
            song(argument);
            break;
        
        case "movie-this" :
            // console.log("movie-this");
            if (!argument){
                console.log("---NO MOVIE SELECTED? Really?---");
                argument = "Mr. Nobody";
            }
            logger("Command: movie-this " + argument);
            movie(argument);
            break;
        
        case "do-what-it-says" :
            // console.log("do-what-it-says");
            logger("Command: do-what-it-says ");
            sayWhatToDo();
            break;
            
        default:
            console.log("Must enter a command.");
            break;
    }
}
