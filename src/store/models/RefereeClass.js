export default class Referee {
  constructor(rawData = {}) {
    const {
      id = null,
      firstName = "",
      lastName = "",
      country = "",
      email = "",
      level = 1,
      userId = "",
    } = rawData;

    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.country = country;
    this.email = email;
    this.level = level;
    this.userId = userId;
  }
  isValid() {
    return this.firstName && this.lastName && this.email && this.country;
  }
}
