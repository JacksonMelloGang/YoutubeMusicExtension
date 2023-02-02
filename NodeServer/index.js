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
var playing = false;


app.post('/discord', (req, res) => {
  console.log("received request from " + req.ip)

  if(req.body.type != undefined){
    res.send("Missing request type (ex: playing|paused|stopped)")
    return;
  }

  let type = toString(req.body.type);

  switch(type){
    case "playing":
      playSong(req, res);
    break;
    
    case "paused":
      pauseSong(req, res);
    break;

    case "stopped":
      stopSong();
    break;

    default:
      console.warn("[WARN] Unknow body type.");
    break;
  }
});

function playSong(req, res){
  if(req.body.details == "Listening to " || req.body.state == "Made by undefined" || req.body.time.includes("NaN")) {
    res.send("No details provided");
    return;
  }

  // a little clean aup :)
  console.clear();

  // get parameters from request for rpc
  var {details, state, time, maxTime, largeImageKey, largeImageText, smallImageKey, smallImageText, instance, type} = req.body;

  //console.log("current time from date(): " + convertDateToSeconds(date))
  //console.log("time: " + convertToSeconds(req.body.time))
  //console.log("end time: " + Math.round(convertDateToSeconds(date) + convertToSeconds(req.body.maxTime)))
  //console.log(`${time} : ${maxTime}`);

  let debutTime = new Date();
  let endTime = Math.round(convertDateToSeconds(date) + convertToSeconds(maxTime));


  
  console.log(` ${details} \n ${state} \n Current Time: ${time} (${date_ms} + ${time}) \n End Time: ${maxTime} (${date_ms} + ${maxTime})`);

  // update discord
  try {
    updateRPC(details, state, debutTime, endTime, 
      largeImageKey, largeImageText, smallImageKey, smallImageText, instance, type);
      
  } catch (err){
    console.error("[ERROR]: Couldn't update Discord. \n" + err)
  }
  
  // return 200 saying it worked
  res.send('Discord Rich Presence Started');  
}

function pauseSong(req, res){
  
}

function stopSong(){
  console.log("disconnecting");
  client.disconnect();
}

async function updateRPC(details, state, startTimestamp, endTimestamp, largeImageKey, largeImageText, smallImageKey, smallImageText, instance, paused = false) {
  let dict = {
    details: details,
    state: paused ? 'Paused' : state,
    startTimestamp: startTimestamp,

    largeImageKey: largeImageKey,
    largeImageText: largeImageText,
    smallImageKey: smallImageKey,
    smallImageText: smallImageText,
    instance: instance,
  }

  if(!paused){
    dict['endTimestamp'] = endTimestamp
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
