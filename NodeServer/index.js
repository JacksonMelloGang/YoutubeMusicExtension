require('dotenv').config();
const express = require('express');
const json = require('body-parser').json;
const cors = require('cors');
const app = express();
const client = require('discord-rich-presence')(process.env.CLIENT_ID);

app.use(cors());
app.use(json());

var old_date = new Date();
var music_title = undefined;
var endTime = 0;



app.post('/discord', (req, res) => {
  if (!req.body) return res.sendStatus(400);

  if(Object.keys(req.body).length != 9){
    console.error("Missing arguments in request body.");
    return;
  }

  if(req.body.details == "Listening to " || req.body.state == "Made by undefined" || req.body.time.includes("NaN")) {
    res.send("No details provided");
    return;
  }

  // a little clean :)
  console.clear();

  // get parameters from request for rpc
  var {details, state, time, maxTime, largeImageKey, largeImageText, smallImageKey, smallImageText, instance} = req.body;

  var date_ms = convertDateToSeconds(new Date()); // get date in ms
  var debutTime = date_ms + convertToSeconds(time); // convert time from request and add it to date_ms & save it

  // changing endtime if new song 
  if(music_title != details.substring(13)){
    console.info("[INFO] Updating music_title & endTime.");

    music_title = details.substring(13);
    endTime = date_ms + convertToSeconds(maxTime); // convert time from request and add it to date_ms & save it
  }

  console.log(` ${details} \n ${state} \n Current Time: ${time} (${debutTime}) \n End Time: ${maxTime} (${endTime})`);

  // update discord
  try {
    updateRPC(details, state, debutTime, endTime, 
      largeImageKey, largeImageText, smallImageKey, smallImageText, instance);
  } catch (err){
    console.error("[ERROR]: Couldn't update Discord. \n" + err)
  }
  
  // return 200 saying it worked
  res.send('Discord Rich Presence Started');
});


async function updateRPC(details, state, startTimestamp, endTimestamp, largeImageKey, largeImageText, smallImageKey, smallImageText, instance) {
  client.updatePresence({
    details: details,
    state: state,
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,

    largeImageKey: largeImageKey,
    largeImageText: largeImageText,
    smallImageKey: smallImageKey,
    smallImageText: smallImageText,
    instance: instance,
  });
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
