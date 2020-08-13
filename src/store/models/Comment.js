export default class Comment {
  constructor(rawData = {}) {
    const {
      id = null,
      commentTournamentId,
      refereeID,
      created = null,
      message = "",
    } = rawData;

    this.id = id;
    this.commentTournamentId = commentTournamentId;
    this.refereeID = refereeID;
    this.created = created || new Date();
    this.message = message;
  }
}
