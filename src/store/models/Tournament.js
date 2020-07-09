import { v4 as uuidv4 } from "uuid";

export default class Tournament {
  constructor(rawData = {}) {
    const {
      id = uuidv4(),
      name = "",
      type = "international",
      city = "",
      country = "",
      date = [],
      td = "",
      referees = [],
      teams = [],
    } = rawData;

    this.id = id;
    this.international = type == "international";
    this.name = name;
    this.city = city;
    this.country = country;
    this.date = date;
    this.td = td;
    this.referees = referees;
    this.teams = teams;
  }
  getYear() {
    if (this.date) {
      return new Date(this.date[0]).getFullYear();
    }
    return new Date().getFullYear();
  }
}
