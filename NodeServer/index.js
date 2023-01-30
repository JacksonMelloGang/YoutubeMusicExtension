require('dotenv').config();
const express = require('express');
const json = require('body-parser').json;
const cors = require('cors');
const app = express();
const client = require('discord-rich-presence')(process.env.CLIENT_ID);

app.use(cors());
app.use(json());

app.post('/discord', (req, res) => {
  console.log("received request from " + req.ip)


  if(req.body.details == "Listening to " || req.body.state == "Made by undefined" || req.body.time.includes("NaN")) {
    res.send("No details provided");
    return;
  }

  console.log(req.body);

  if (!req.body) return res.sendStatus(400);

  // get parameters from request for rpc
  var {details, state, time, maxTime, largeImageKey, largeImageText, smallImageKey, smallImageText, instance} = req.body;
  var date = new Date();

  //console.log("current time from date(): " + convertDateToSeconds(date))
  //console.log("time: " + convertToSeconds(req.body.time))
  //console.log("end time: " + Math.round(convertDateToSeconds(date) + convertToSeconds(req.body.maxTime)))
  //console.log(`${time} : ${maxTime}`);

  let debutTime = new Date();
  let endTime = Math.round(convertDateToSeconds(date) + convertToSeconds(maxTime));


  // start discord rich presence
  updateRPC(details, state, debutTime, endTime, 
    largeImageKey, largeImageText, smallImageKey, smallImageText, instance);
  
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
