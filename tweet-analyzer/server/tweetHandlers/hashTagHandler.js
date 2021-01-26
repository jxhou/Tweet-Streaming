const hashTagsStore = {}

function processHashTags(hashTags) {

  if (hashTags && hashTags.length > 0) {

    hashTags.forEach(element => {
      const text = element.text;
      hashTagsStore[text] = hashTagsStore[text]? hashTagsStore[text] + 1 : 1;
    });
  }

  return hashTags.length;
}

// get top cnt of emojis
function getTopHashTags(cnt = 3) {
  if (Object.keys(hashTagsStore).length === 0) {
    return null;
  }

  const arr = Object.entries(hashTagsStore);
  const sorted = arr.sort((a,b) => b[1] - a[1]);
  return sorted.slice(0,cnt);
}

module.exports = {
  processHashTags,
  getTopHashTags
}