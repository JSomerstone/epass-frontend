
export default class Tournament {
  constructor(rawData = {}, refereeList = []) {
    const {
      id = null,
      name = "",
      international = true,
      city = "",
      country = "",
      year = null,
      dates = [],
      td = {},
      referees = [],
      teams = [],
    } = rawData;

    this.id = id;
    this.international = international;
    this.name = name;
    this.city = city;
    this.country = country;
    this.dates = dates.map(d => new Date(d));
    this.year = year || new Date().getFullYear();
    //this.dates = dates;
    this.td = td.id ? td : this.getRef(td, refereeList);
    this.referees = referees.map(
      r => {
        return {
          ...this.getRef(r.id, refereeList),
          ...r
        }
      }
    );
    this.teams = teams;
  }
  getRef(id, refereeList) {
    return refereeList.find(
      r => r.id == id
    ) || {};
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
  toJson() {
    return {
      id: this.id,
      international: this.international,
      name: this.name,
      city: this.city,
      country: this.country,
      dates: this.dates.map(d => d.toUTCString()),
      year: this.year,
      td: this.td.id,
      referees: this.referees.map(
        r => {
          const { id, games = 0, tenSeconds = 0 } = r;
          return { id, games, tenSeconds };
        }
      ),
      teams: this.teams,
    };
  }
}
