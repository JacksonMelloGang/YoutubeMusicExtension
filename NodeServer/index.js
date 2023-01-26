require('dotenv').config();
const express = require('express');
const json = require('body-parser').json;
const app = express();
const client = require('discord-rich-presence')(process.env.CLIENT_ID);

app.use(json());

app.post('/discord', (req, res) => {
  
  if (!req.body) return res.sendStatus(400);

  // get parameters from request for rpc
  var {details, state, largeImageKey, largeImageText, smallImageKey, smallImageText, instance} = req.body;

  if(!details) title = "Listening to ";
  if(!state) music_name = "State";
  if(!largeImageKey) largeImageKey = "large_image";
  if(!largeImageText) largeImageText = "Large Image Text";
  if(!smallImageKey) smallImageKey = "small_image";
  if(!smallImageText) smallImageText = "Small Image Text";
  if(!instance) instance = false;


  // start discord rich presence
  updateRPC(title, music_name, new Date(), largeImageKey, largeImageText, smallImageKey, smallImageText, instance);
  
  // return 200 saying it worked
  res.send('Discord Rich Presence Started');
});

async function updateRPC(details, state, startTimestamp, largeImageKey, largeImageText, smallImageKey, smallImageText, instance) {

  client.updatePresence({
    details: details,
    state: state,
    startTimestamp: startTimestamp,
    largeImageKey: largeImageKey,
    largeImageText: largeImageText,
    smallImageKey: smallImageKey,
    smallImageText: smallImageText,
    instance: instance,
  });
}



app.listen(process.env.PORT, () => {
    console.log('App listening on port ', process.env.PORT, ' ! ');
});
