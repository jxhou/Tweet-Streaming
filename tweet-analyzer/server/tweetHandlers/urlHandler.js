const domainStore = {}

function processUrls(urls) {
  const re = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img;

  if (urls && urls.length > 0) {

    urls.forEach(element => {
      const text = element.expanded_url.match(re);
      domainStore[text] = domainStore[text]? domainStore[text] + 1 : 1;
    });
  }

  return urls.length;
}

// get top cnt of emojis
function getTopDomains(cnt = 3) {
  if (Object.keys(domainStore).length === 0) {
    return null;
  }

  const arr = Object.entries(domainStore);
  const sorted = arr.sort((a,b) => b[1] - a[1]);
  return sorted.slice(0, cnt);
}

module.exports = {
  processUrls,
  getTopDomains
}