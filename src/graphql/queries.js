/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getReferee = /* GraphQL */ `
  query GetReferee($id: ID!) {
    getReferee(id: $id) {
      id
      firstName
      lastName
      country
      email
      level
      userId
      clinic {
        date
        conductor
      }
      createdAt
      updatedAt
    }
  }
`;
export const listReferees = /* GraphQL */ `
  query ListReferees(
    $filter: ModelRefereeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReferees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        lastName
        country
        email
        userId
      }
      nextToken
    }
  }
`;
export const getTournament = /* GraphQL */ `
  query GetTournament($id: ID!) {
    getTournament(id: $id) {
      id
      name
      international
      city
      country
      year
      dates
      td
      referees {
        games
        tenSeconds
        id
      }
      teams
      createdAt
      updatedAt
    }
  }
`;
export const listTournaments = /* GraphQL */ `
  query ListTournaments(
    $filter: ModelTournamentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTournaments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        international
        city
        country
        year
        dates
        td
        referees {
          games
          tenSeconds
          id
        }
        teams
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
