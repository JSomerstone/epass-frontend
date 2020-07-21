import Tournament from "../../../src/store/models/Tournament";

const today = new Date();

describe("TournamentClass", () => {
  it("Validates itself correctly", () => {
    const t = new Tournament({
      name: "test",
      city: "valid",
      country: "Finland",
      year: 2020,
      dates: [today.toISOString(), today.toISOString()],
      td: { id: "bogus-referee-id" },
      referees: [{ id: "another-referee-id", games: 1, tenSeconds: 2 }],
      teams: ["Team A", "Team B"]
    });

    const result = t.validate();
    expect(result).toEqual([]);
  });
});