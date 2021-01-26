const config = require('dotenv').config()
const redis = require('redis')

// const emojiHandler = require('./emojiHandler')
const tweetProcessor = require('./tweetProcessor')

const tweetChannel = process.env.TWEET_CHANNEL;

let subClient = null;

function quit() {
  if (subClient) {
    subClient.quit();
  }

  subClient = null;
}

function start(socket) {
  // quit first if there is an existing session
  quit()

  subClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retry_strategy: () => 1000,
  });

  subClient.on("error", function(error) {
    console.error(error);
  });

  subClient.on("ready", function(data) {
    console.log('Successfully connected to redis server.');
  });

  subClient.on("subscribe", function(channel, count) {
    console.log(`${channel} subscribed with count: ${count}`);
  });

  subClient.on("message", function(channel, message) {
    // console.log(`Message received from channel: ${channel}: ${message}`);
    try {
      const tweet = JSON.parse(message);
      // const emojis = emojiHandler.getEmojis(tweet.text);
      // emojiHandler.processEmojis(tweet.text);
      tweetProcessor.processTweet(tweet);

    } catch (ex) {
      console.log('failed to process the tweet.')
    }
    
  });

  // let subscribe the tweet channel
  subClient.subscribe(tweetChannel);
}

module.exports = {
  start,
  quit,
}