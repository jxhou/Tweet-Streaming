const HandlerBase = require("./handlerBase");

// function processPhotos(media) {
//   let cnt = 0;
//   if (media && media.length > 0) {
//     media.forEach(element => {
//       if (element.type === 'photo') {
//         cnt++;
//       }
//     });
//   }

//   return cnt;
// }

// module.exports = {
//   processPhotos,
// }

class MediaHandler extends HandlerBase {
  constructor() {
    super('tweetCountWithPhotoUrl');
    this.tweetCountWithPhotoUrl = 0;
  }

  process(tweet) {
    const media = tweet && tweet.entities.media;
    let cnt = 0;
    if (media && media.length > 0) {
      media.forEach(element => {
        if (element.type === 'photo') {
          cnt++;
        }
      });
    }
    if (cnt > 0) {
      this.tweetCountWithPhotoUrl += 1;
    }

    return cnt;
  }

  getCurrentStats() {
    return this.tweetCountWithPhotoUrl;
  }
}

module.exports = MediaHandler;