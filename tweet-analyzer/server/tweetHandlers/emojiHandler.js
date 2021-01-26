const emojiRegex = require('emoji-regex/RGI_Emoji.js');
const regex = emojiRegex();

const emojiStat = {}

function getEmojis(str) {
  if (!str) {
    return [];
  }

  const matches = str.match(regex);
  return matches? matches: [];
}

function processEmojis(str) {
  const found = getEmojis(str)

  found.forEach(element => {
    emojiStat[element] = emojiStat[element]? emojiStat[element] + 1 : 1
  });

  if (found.length) {
    // console.log(emojiStat);
  }
  return found.length;
}

// get top cnt of emojis
function getTopEmoji(cnt = 3) {
  if (Object.keys(emojiStat).length === 0) {
    return null;
  }

  // const sorted = Object.entries(emojiStat).sort((a,b) => a[1] - b[1]);
  // return sorted[1];
  // return sorted[0];
  const arr = Object.entries(emojiStat);
  const sorted = arr.sort((a,b) => b[1] - a[1]);
  return sorted.slice(0,cnt);
}

module.exports = {
  getEmojis,
  processEmojis,
  getTopEmoji
}