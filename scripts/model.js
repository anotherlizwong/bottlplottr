var COLOR_ID_SEQ = 0;

function Color(name, hex, count, id) {
  this.name = name;
  this.hex = hex;
  this.count = count;
  this.id = id;

  this.increment = function () {
    this.count = this.count + 1;
  };

  this.decrement = function () {
    this.count = this.count - 1;
  }

  this.toString = function () {
    return "id[" + id + "], name[" + name + "], hex[" + hex + "], count[" + count + "]";
  }
}


function getNextColorSeqId() {
  return COLOR_ID_SEQ++;
}