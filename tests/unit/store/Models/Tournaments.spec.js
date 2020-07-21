import Tournament from "../../../../src/store/models/Tournament";
import tournaments from "../../../../src/store/modules/tournaments";

const today = new Date();
const validTournament = {
  name: "test",
  city: "valid",
  country: "Finland",
  year: 2020,
  dates: [today.toISOString(), today.toISOString()],
  td: { id: "bogus-referee-id" },
  referees: [{ id: "another-referee-id", games: 1, tenSeconds: 2 }],
  teams: ["Team A", "Team B"]
};
describe("TournamentClass", () => {
  it("Validates itself correctly", () => {
    const tounament = new Tournament(validTournament);
    const result = tounament.validate();
    expect(result).toEqual([]);
  });

  it("Validation detects invalid property", () => {
    const tounament = new Tournament({
      ...validTournament,
      international: "invalid",
      year: 47,
      td: {},
      referees: [],
      teams: ["Highlander"]
    });
    const result = tounament.validate();
    expect(result).toEqual([
      "international", "year", "td", "referees", "teams"
    ]);
  });
});