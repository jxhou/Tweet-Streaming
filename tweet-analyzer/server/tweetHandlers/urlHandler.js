const HandlerBase = require('./handlerBase')
// const domainStore = {}

// function processUrls(urls) {
//   const re = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img;

//   if (urls && urls.length > 0) {

//     urls.forEach(element => {
//       const text = element.expanded_url.match(re);
//       domainStore[text] = domainStore[text]? domainStore[text] + 1 : 1;
//     });
//   }

//   return urls.length;
// }

// // get top cnt of emojis
// function getTopDomains(cnt = 3) {
//   if (Object.keys(domainStore).length === 0) {
//     return null;
//   }

//   const arr = Object.entries(domainStore);
//   const sorted = arr.sort((a,b) => b[1] - a[1]);
//   return sorted.slice(0, cnt);
// }

// module.exports = {
//   processUrls,
//   getTopDomains
// }

class UrlHandler extends HandlerBase {
  constructor() {
    super('urls');
    this.domainStore = {};
    this.tweetCountWithUrl = 0;
  }

  // get top cnt of emojis
  getTopDomains(cnt = 3) {
    if (Object.keys(this.domainStore).length === 0) {
      return null;
    }

    const arr = Object.entries(this.domainStore);
    const sorted = arr.sort((a,b) => b[1] - a[1]);
    return sorted.slice(0, cnt);
  }

  process(tweet) {
    const urls = tweet && tweet.entities && tweet.entities.urls;

    const re = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img;

    if (urls && urls.length > 0) {

      urls.forEach(element => {
        const text = element.expanded_url.match(re);
        this.domainStore[text] = this.domainStore[text]? this.domainStore[text] + 1 : 1;
      });
    }

    if (urls && urls.length > 0) {
      this.tweetCountWithUrl += 1;
    }

    return urls && urls.length;
  }

  getCurrentStats() {
    return { 
      topDomains: this.getTopDomains(),
      tweetCountWithUrl: this.tweetCountWithUrl
    }
  }
}

module.exports = UrlHandler;