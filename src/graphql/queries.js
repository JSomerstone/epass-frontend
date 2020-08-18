/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getReferee = /* GraphQL */ `
  query GetReferee($id: ID!) {
    getReferee(id: $id) {
      id
      firstName
      lastName
      country
      country2
      email
      level
      userId
      clinic {
        date
        level
        conductor
      }
      levelHistory
      associationId
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
      comments {
        items {
          id
          refereeID
          created
          message
          createdAt
          updatedAt
        }
        nextToken
      }
      createdBy
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
        createdBy
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tournament {
          id
        }
        refereeID
        created
        message
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAssociation = /* GraphQL */ `
  query GetAssociation($id: ID!) {
    getAssociation(id: $id) {
      id
      country
      name
      address
      email
      coordinator
      coordinatorEmail
      createdAt
      updatedAt
    }
  }
`;
export const listAssociations = /* GraphQL */ `
  query ListAssociations(
    $filter: ModelAssociationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAssociations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        country
        name
        address
        email
        coordinator
        coordinatorEmail
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const tournamentsByYear = /* GraphQL */ `
  query TournamentsByYear(
    $year: Int
    $sortDirection: ModelSortDirection
    $filter: ModelTournamentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tournamentsByYear(
      year: $year
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        createdBy
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
