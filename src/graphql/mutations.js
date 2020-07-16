/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createReferee = /* GraphQL */ `
  mutation CreateReferee(
    $input: CreateRefereeInput!
    $condition: ModelRefereeConditionInput
  ) {
    createReferee(input: $input, condition: $condition) {
      id
      firstName
      lastName
      country
      email
      level
      userId
      createdAt
      updatedAt
    }
  }
`;
export const updateReferee = /* GraphQL */ `
  mutation UpdateReferee(
    $input: UpdateRefereeInput!
    $condition: ModelRefereeConditionInput
  ) {
    updateReferee(input: $input, condition: $condition) {
      id
      firstName
      lastName
      country
      email
      level
      userId
      createdAt
      updatedAt
    }
  }
`;
export const deleteReferee = /* GraphQL */ `
  mutation DeleteReferee(
    $input: DeleteRefereeInput!
    $condition: ModelRefereeConditionInput
  ) {
    deleteReferee(input: $input, condition: $condition) {
      id
      firstName
      lastName
      country
      email
      level
      userId
      createdAt
      updatedAt
    }
  }
`;
export const createTournament = /* GraphQL */ `
  mutation CreateTournament(
    $input: CreateTournamentInput!
    $condition: ModelTournamentConditionInput
  ) {
    createTournament(input: $input, condition: $condition) {
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
export const updateTournament = /* GraphQL */ `
  mutation UpdateTournament(
    $input: UpdateTournamentInput!
    $condition: ModelTournamentConditionInput
  ) {
    updateTournament(input: $input, condition: $condition) {
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
export const deleteTournament = /* GraphQL */ `
  mutation DeleteTournament(
    $input: DeleteTournamentInput!
    $condition: ModelTournamentConditionInput
  ) {
    deleteTournament(input: $input, condition: $condition) {
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
