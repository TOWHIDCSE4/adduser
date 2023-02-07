const schedule = require('node-schedule');
class Base {
  static schedule = "* * * * * *"
  static handle

  static start() {
    if (!this.schedule) {
      return;
    }
    if (typeof this.handle != "function") {
      throw new Error("Handle is not callable")
    }
    schedule.scheduleJob(this.schedule, () => {
      this.handle()
    });
  }
}

export default Base
