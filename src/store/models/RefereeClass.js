import { v4 as uuidv4 } from "uuid";

export default class Referee {
  constructor(rawData = {}) {
    const {
      id = uuidv4(),
      firstName = "",
      lastName = "",
      country = "",
      email = "",
      level = 1,
      games = 0,
      tenSeconds = 0,
    } = rawData;

    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.country = country;
    this.email = email;
    this.level = level;
    this.games = games;
    this.tenSeconds = tenSeconds;
  }
}
