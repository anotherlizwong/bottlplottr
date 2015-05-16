function bottle_cap(color) {
    this.color = color;
    this.describe = function() {
        return "I'm a bottle cap of color " + this.color;
    };
}

