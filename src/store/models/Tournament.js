import Comment from "./Comment";

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
      comments = { items: [] },
      createdBy = null,
    } = rawData;

    this.id = id;
    this.international = international;
    this.name = name;
    this.city = city;
    this.country = country;
    this.dates = dates.map(d => new Date(d));
    this.year = year || new Date().getFullYear();
    this.td = typeof td == "string" ? this.getRef(td, refereeList) : td;
    this.referees = referees.map(
      r => {
        return {
          ...this.getRef(r.id, refereeList),
          ...r
        }
      }
    );
    this.comments = {
      items: comments.items.map(c => new Comment(c))
    }
    this.teams = teams;
    this.createdBy = createdBy;
  }
  getRef(id, refereeList) {
    return refereeList.find(
      r => r.id == id
    ) || {};
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
      createdBy: this.createdBy
    };
  }

  validate() {
    const validity = {
      international: typeof this.international == "boolean",
      name: this.name.length > 2,
      city: this.city.length >= 2,
      country: this.country != "",
      dates: this.dates.length == 2,
      year: 2019 <= this.year && this.year <= new Date().getFullYear()+1
    };
    const errors = Object.entries(validity)
      .filter(entry => !entry[1])
      .map(entry => entry[0]);
    return errors;
  }

  isValid() {
    return this.validate().length == 0;
  }
}
