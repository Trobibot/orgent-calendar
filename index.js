const ORIGIN_DATE = new Date("1324-12-05");

class Cycle {
  constructor(day = "01", period = "01", cycle = "01") {
    this.day = parseInt(day);
    this.period = parseInt(period);
    this.cycle = parseInt(cycle);
  }

  // Alternative constructor
  fromDate(date) {
    const convertedDate = dateToCycle(date);
    this.cycle = convertedDate.cycle;
    this.period = convertedDate.period;
    this.day = convertedDate.day;
    return this;
  }

  fromISODate(date) {
    return this.fromDate(new Date(date));
  }

  //Show cycle
  toLiteralString() {
    const strDay = this.day == 1 ? this.day + "er" : this.day + "ème";
    const strPeriod = ["d'Aube", "de Zenith", "d'Obscurité"][this.period - 1];
    const strCycle = this.period == 1 ? this.cycle + "er" : this.cycle + "ème";
    return `${strDay} jour ${strPeriod} du ${strCycle} cycle`;
  }

  toFormalString() {
    const strDay = this.day <= 9 ? "0" + this.day : this.day;
    const strPeriod = "0" + this.period;
    const strCycle = this.cycle <= 9 ? "0" + this.cycle : this.cycle;
    return `${strDay}-${strPeriod}-${strCycle}`;
  }

  toDate() {
    const date = new Date(ORIGIN_DATE.getTime());
    const days = (this.cycle - 1) * 270 + (this.period - 1) * 90 + this.day;
    date.setDate(date.getDate() + days);
    return new Date(date.toDateString());
  }

  addDay(days = 1) {
    let deltaDays = this.day + days;
    if (deltaDays > 90 || deltaDays < 1) {
      this.addPeriod(Math.ceil(deltaDays / 90) - 1);
      deltaDays = Math.abs(deltaDays % 90) != 0 ? Math.abs(deltaDays % 90) : 90;
    }
    this.day = deltaDays;
  }

  addPeriod(periods = 1) {
    let deltaPeriods = this.period + periods;
    if (deltaPeriods > 3 || deltaPeriods < 1) {
      this.addCycle(Math.ceil(deltaPeriods / 3) - 1);
      deltaPeriods =
        Math.abs(deltaPeriods % 3) != 0 ? Math.abs(deltaPeriods % 3) : 3;
    }
    this.period = deltaPeriods;
  }

  addCycle(cycles = 1) {
    let deltaCycles = this.cycle + cycles;
    if (deltaCycles < 1) {
      throw `${deltaCycles} is not a valid cycle number`;
    }
    this.cycle = deltaCycles;
  }
}

function dateToCycle(date) {
  date.setHours(0, 0, 0, 0);
  deltaDays =
    Math.ceil(
      (date.getTime() - ORIGIN_DATE.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  return {
    cycle: Math.ceil(deltaDays / 270),
    period: Math.ceil((deltaDays % 270) / 90),
    day:
      Math.ceil((deltaDays % 270) % 90) != 0
        ? Math.ceil((deltaDays % 270) % 90)
        : 90
  };
}

exports.Cycle = Cycle;
