
function processPhotos(media) {
  let cnt = 0;
  if (media && media.length > 0) {
    media.forEach(element => {
      if (element.type === 'photo') {
        cnt++;
      }
    });
  }

  return cnt;
}

module.exports = {
  processPhotos,
}