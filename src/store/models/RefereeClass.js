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
      clinic = {
        date: null,
        conductor: ""
      },
      associationId = null,
    } = rawData;

    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.country = country;
    this.email = email;
    this.level = level;
    this.userId = userId;
    this.clinic = clinic;
    if (this.clinic.date != null) {
      this.clinic.date = new Date(this.clinic.date);
    }
    this.associationId = associationId;
  }
  isValid() {
    return this.firstName && this.lastName && this.email && this.country;
  }
}
