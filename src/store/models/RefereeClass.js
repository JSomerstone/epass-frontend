export default class Referee {
  constructor(rawData = {}) {
    const {
      id = null,
      firstName = "",
      lastName = "",
      country = "",
      country2 = null,
      email = "",
      level = 1,
      userId = "",
      clinic = null,
      associationId = null,
      levelHistory = null
    } = rawData;

    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.country = country;
    this.country2 = country2;
    this.email = email;
    this.level = level;
    this.userId = userId;
    this.clinic = clinic || {
      date: null,
      level: 1,
      conductor: ""
    };
    if (this.clinic.date != null) {
      this.clinic.date = new Date(this.clinic.date);
    }
    this.associationId = associationId;
    this.levelHistory = levelHistory
      ? typeof levelHistory == "string" ? JSON.parse(levelHistory) : levelHistory
      : {}
  }
  isValid() {
    return this.firstName && this.lastName;
  }
  setClinic({ date = null, level = 1, conductor = "" }) {
    let year = `y${new Date(date).getFullYear()}`;
    this.levelHistory[year] = level;
    this.clinic = { date, level, conductor };
  }
}
