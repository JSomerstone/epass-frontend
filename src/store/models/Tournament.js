import { v4 as uuidv4 } from "uuid";

export default class Tournament {
  constructor(rawData = {}) {
    const {
      id = uuidv4(),
      name = "",
      type = "international",
      city = "",
      country = "",
      dates = [],
      td = "",
      referees = [],
      teams = [],
    } = rawData;

    this.id = id;
    this.international = type == "international";
    this.name = name;
    this.city = city;
    this.country = country;
    this.dates = dates;
    this.td = td.id ? td.id : td;
    this.referees = referees.map(
      r => {
        const { id, games, tenSeconds } = r;
        return { id, games, tenSeconds }
      }
    );
    this.teams = teams;
  }
  getYear() {
    if (this.date) {
      return new Date(this.date[0]).getFullYear();
    }
    return new Date().getFullYear();
  }
  setGames(refereeId, games, tenSeconds) {
    const index = this.referees.findIndex(
      r => r.id === refereeId
    )
    if (index < 0) {
      return;
    }
    Object.assign(
      this.referees[index],
      { games, tenSeconds }
    );
  }
}
