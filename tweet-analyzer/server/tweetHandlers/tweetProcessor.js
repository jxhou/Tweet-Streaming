const emojiHandler = require('./emojiHandler');
const hashTagHandler = require('./hashTagHandler');
const urlHandler = require('./urlHandler');
const mediaHandler = require('./mediaHandler');

// support a client notification.
let clientSocket = null
let lastNotificationTime = 0;
const notificationInterval = 1000; // every second

let stat = {
  tweetCount: 0,
  tweetCountWithEmoji: 0,
  tweetCountWithUrl: 0,
  tweetCountWithPhotoUrl: 0,
  startTime: Date.now(),
  topEmojis: [],
  topHashTags: [],
  topDomains: []
};

// Helper to build a current statistics for the tweets
function getStats() {
  const now = Date.now();
  const t = stat.tweetCount;
  const timeSpanSec = (now - stat.startTime) / 1000;
  const cntPerSec = Math.ceil(stat.tweetCount / timeSpanSec);
  const stats = {
    totalTweets: stat.tweetCount,
    avgTwPerHr: cntPerSec * 60 * 60,
    avgTwPerMin: cntPerSec * 60,
    avgTwPerSec: cntPerSec,
    topEmojis: stat.topEmojis,
    topHashTags: stat.topHashTags,
    topDomains: stat.topDomains,
    emojiPercent: Math.floor(100 * stat.tweetCountWithEmoji / stat.tweetCount),
    urlPercent: Math.floor(100 * stat.tweetCountWithUrl / stat.tweetCount),
    photoUrlPercent: Math.floor(100 * stat.tweetCountWithPhotoUrl / stat.tweetCount)
  };

  return stats;
}

function sendNotification() {
  const now = Date.now();
  const timeSpan = now - lastNotificationTime;
  const tweetStats = process.env.TWEET_STAT;

  if (timeSpan > notificationInterval && clientSocket) {
    lastNotificationTime = now; 
    clientSocket.emit(tweetStats, getStats())
  }

}

// This function is called for every tweet received.
function processTweet(tweet) {
  if (!tweet) {
    return;
  }

  // Handle total tweet count
  if (stat.tweetCount === 0) {
    stat.startTime = Date.now();
  }
  stat.tweetCount += 1;

  // handle emojis
  const hasEmoji = emojiHandler.processEmojis(tweet.text);
  if (hasEmoji) {
    stat.tweetCountWithEmoji += 1;
  }

  stat.topEmojis = emojiHandler.getTopEmoji();

  // handle hashtags
  hashTagHandler.processHashTags(tweet.entities.hashtags);
  stat.topHashTags = hashTagHandler.getTopHashTags();

  // handle url domain
  const urlCnt = urlHandler.processUrls(tweet.entities.urls);
  stat.topDomains = urlHandler.getTopDomains();
  if (urlCnt > 0) {
    stat.tweetCountWithUrl += 1;
  }

  // handle photo 
  const photoCnt = mediaHandler.processPhotos(tweet.entities.media);
  if (photoCnt > 0) {
    stat.tweetCountWithPhotoUrl += 1;
  }

  // send stats to client if needed.
  sendNotification();

  console.log(stat)
}

// we only support a single client at this time
function registerNotificationSocket(socket) {
  clientSocket = socket;
}

module.exports = {
  processTweet,
  registerNotificationSocket,
  getStats
}