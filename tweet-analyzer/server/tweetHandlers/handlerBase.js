class HandlerBase {
  constructor(name) {
    this.name = name;
  }
  
  process() {
    throw 'not implemented';
  }

  getCurrentStats() {
    throw 'not implemented';
  }

  outputStats (statStore) {
    if (!statStore) {
      return;
    }

    statStore[this.name] = this.getCurrentStats();
  }
}

module.exports = HandlerBase;