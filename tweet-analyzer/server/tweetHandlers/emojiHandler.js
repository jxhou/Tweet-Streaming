const emojiRegex = require('emoji-regex/RGI_Emoji.js');
const HandlerBase = require('./handlerBase');
const regex = emojiRegex();

// const emojiStat = {}

// function getEmojis(str) {
//   if (!str) {
//     return [];
//   }

//   const matches = str.match(regex);
//   return matches? matches: [];
// }

// function processEmojis(str) {
//   const found = getEmojis(str)

//   found.forEach(element => {
//     emojiStat[element] = emojiStat[element]? emojiStat[element] + 1 : 1
//   });

//   if (found.length) {
//     // console.log(emojiStat);
//   }
//   return found.length;
// }

// // get top cnt of emojis
// function getTopEmoji(cnt = 3) {
//   if (Object.keys(emojiStat).length === 0) {
//     return null;
//   }

//   // const sorted = Object.entries(emojiStat).sort((a,b) => a[1] - b[1]);
//   // return sorted[1];
//   // return sorted[0];
//   const arr = Object.entries(emojiStat);
//   const sorted = arr.sort((a,b) => b[1] - a[1]);
//   return sorted.slice(0,cnt);
// }

// module.exports = {
//   getEmojis,
//   processEmojis,
//   getTopEmoji
// }

class EmojiHandler extends HandlerBase {
  constructor() {
    super('emojis');
    this.tweetCountWithEmoji = 0;
    this.emojiStat = {};
  }

  getEmojis(str) {
    if (!str) {
      return [];
    }
  
    const matches = str.match(regex);
    return matches? matches: [];
  }

  // get top cnt of emojis
  getTopEmoji(cnt = 3) {
    if (Object.keys(this.emojiStat).length === 0) {
      return null;
    }

    const arr = Object.entries(this.emojiStat);
    const sorted = arr.sort((a,b) => b[1] - a[1]);
    return sorted.slice(0,cnt);
  }

  process(tweet) {
    const text = tweet && tweet.text;

    const found = this.getEmojis(text)

    found.forEach(element => {
      this.emojiStat[element] = this.emojiStat[element]? this.emojiStat[element] + 1 : 1
    });

    if (found.length) {
      this.tweetCountWithEmoji += 1;
    }
    return found.length;
  }

  getCurrentStats() {
    return { 
      topEmojis: this.getTopEmoji(),
      tweetCountWithEmoji: this.tweetCountWithEmoji
    }
  }
}

module.exports = EmojiHandler;