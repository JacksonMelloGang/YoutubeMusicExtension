require('dotenv').config();
const express = require('express');
const json = require('body-parser').json;
const cors = require('cors');
const app = express();
const client = require('discord-rich-presence')(process.env.CLIENT_ID);

app.use(cors());
app.use(json());

var music_title = undefined;
var endTime = 0;
var old_type = "";
var saved_date = new Date().getTime();
var music_url = "";

app.post('/discord', (req, res) => {
  //console.log("received request from " + req.ip)
  
  if(req.body.type == undefined){
    console.log("type is undefined");
    res.send("Missing request type (ex: playing|paused|stopped)");
    return;
  }

  if(req.body.length == 0){
    res.send("No body provided");
    return;
  }

  if(req.body.details == "Listening to " || req.body.state == "Made by undefined" || req.body.time.includes("NaN")) {
    res.send("No details provided");
    return;
  }

  // a little clean aup :)
  console.clear();

  // get parameters from request for rpc
  var {details, state, time, maxTime, largeImageKey, largeImageText, smallImageKey, smallImageText, instance, type, url} = req.body;
  var date = new Date();
  
  let date_ms = convertDateToSeconds(new Date());
  let debutTime = date_ms + convertToSeconds(time); // convert time from request and add it to date_ms & save it

  // changing endtime if new song 
  if(music_title != details.substring(13) || old_type != type){
    console.info("[INFO] Updating music_title & endTime.");

    music_title = details.substring(13);
    old_type = type;
    saved_date = new Date().getTime();
    //endTime = Math.round(date_ms + convertToSeconds(maxTime)); // convert time from request and add it to date_ms & save it
    music_url = url;
  }

  endTime = Math.round(date_ms + convertToSeconds(maxTime)); // convert time from request and add it to date_ms & save it

  button = {label: "Listen on Youtube", url: `${music_url}&t=${convertToSeconds(time)}`}
  
  console.log(` ${details} \n ${state} \n Current Time: ${time} \n End Time: ${maxTime} \n Status: ${type} \n URL: ${music_url}`);

  switch(type){
    case "playing":
      timeleft = endTime - convertToSeconds(time);
      playSong(details, state, null, timeleft, largeImageKey, largeImageText, smallImageKey, smallImageText, instance, button);
    break;
    
    case "paused":
      pauseSong(details, state, date_ms, largeImageKey, largeImageText, smallImageKey, smallImageText, instance, button);
    break;

    case "stopped":
      stopSong();
    break;

    default:
      console.warn("[WARN] Unknow body type.");
    break;
  }

  // return 200 saying it worked
  res.send('Discord Rich Presence Started');  
});


function playSong(details, state, debutTime, endTime, largeImageKey, largeImageText, smallImageKey, smallImageText, instance, button){
  
  // update discord
  try {
    updateRPC(details, state, debutTime, endTime, 
      largeImageKey, largeImageText, smallImageKey, smallImageText, instance, button);      
  } catch (err){
    console.error("[ERROR]: Couldn't update Discord. \n" + err)
  }
}

function pauseSong(details, state, debutTime, largeImageKey, largeImageText, smallImageKey, smallImageText, instance, button){

  // update discord
  try {
    updateRPC(`${details} ${state}`, "Paused", debutTime, null, 
      largeImageKey, largeImageText, smallImageKey, smallImageText, instance, button);      
  } catch (err){
    console.error("[ERROR]: Couldn't update Discord. \n" + err)
  }

}

function stopSong(){
  client.disconnect();
}

async function updateRPC(details, state, startTimestamp = null, endTimestamp = null, largeImageKey, largeImageText, smallImageKey, smallImageText, instance, button=null) {

  
  let dict = {
    details: details,
    state: state,

    largeImageKey: largeImageKey,
    largeImageText: largeImageText,
    smallImageKey: smallImageKey,
    smallImageText: smallImageText,
    instance: instance,
  }

  if(startTimestamp != null){
    dict['startTimestamp'] = startTimestamp;
  }

  if(endTimestamp != null){
    dict['endTimestamp'] = endTimestamp;
  }

  if(button != null){
    dict['buttons'] = new Array(button);
  }

  client.updatePresence(dict);
}

function convertDateToSeconds(date) {
  return Math.round(date.getTime() / 1000);
}

function convertToSeconds(time) {
  let parts = time.split(':');
  
  let hours = parts.length > 3 ? parseInt(parts[0], 10) : 0;
  let minutes = parts.length > 3 ? parseInt(parts[1], 10) : parseInt(parts[0], 10);
  let seconds = parts.length > 3 ? parseInt(parts[2], 10) : parseInt(parts[1], 10);
  
  return (hours * 3600) + (minutes * 60) + seconds;
}

app.listen(process.env.PORT, () => {
    console.log('App listening on port ', process.env.PORT, ' ! ');
});
