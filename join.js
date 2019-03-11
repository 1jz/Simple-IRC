function command(interval) {
    this.interval = interval || 3000;
    this.queue = [];
    this.joined = [];
    this.inProgress = true;
}

command.prototype.add = function add(func, channel, type) {
    this.queue.push({
        func: func,
        channel: channel,
        type: type
    });
    // 0 = JOIN
}

command.prototype.exec = function next(){
    if (this.queue.length === 0) {
        this.inProgress = false;
        return;
    } else {
        this.inProgress = true;
        setTimeout(() => {
            this.queue[0].func();
            this.queue.shift();
            this.exec();
        }, this.interval);
    }
}

module.exports = command;