const express = require('express')
require('dotenv').config()
const Twit = require('twit') 
const redis = require('redis')

const publisher = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: () => 1000,
});

publisher.on("error", function(error) {
  console.error(error);
});

publisher.on("ready", function(data) {
  console.log('Successfully connected to redis server.');
});

var twitter = new Twit({
    consumer_key:  process.env.TWITTER_API_KEY,
    consumer_secret:  process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN ,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  
// attach to filter stream
 var tweetStream = twitter.stream('statuses/sample');
  
// on tweet
tweetStream.on('tweet', function (tweet) {
  console.log('---');
  console.log('tweet.entities:', tweet.entities);
  // console.log('text:', tweet.text);

  const {text, entities} = tweet;
  const extracted = { text, entities }

  publisher.publish('tweet', JSON.stringify(extracted))
});

// on tweet
tweetStream.on('error', function (err) {
  console.log('---');
  console.log(err);
});

// on disconnected
tweetStream.on('disconnect', function (disconnectMessage) {
  console.log('---');
  console.log(disconnectMessage);
});