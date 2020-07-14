/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTournament = /* GraphQL */ `
  subscription OnCreateTournament {
    onCreateTournament {
      id
      name
      international
      city
      country
      dates
      td {
        id
        firstName
        lastName
        country
        email
        level
        createdAt
        updatedAt
      }
      referees {
        id
        firstName
        lastName
        country
        email
        level
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTournament = /* GraphQL */ `
  subscription OnUpdateTournament {
    onUpdateTournament {
      id
      name
      international
      city
      country
      dates
      td {
        id
        firstName
        lastName
        country
        email
        level
        createdAt
        updatedAt
      }
      referees {
        id
        firstName
        lastName
        country
        email
        level
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTournament = /* GraphQL */ `
  subscription OnDeleteTournament {
    onDeleteTournament {
      id
      name
      international
      city
      country
      dates
      td {
        id
        firstName
        lastName
        country
        email
        level
        createdAt
        updatedAt
      }
      referees {
        id
        firstName
        lastName
        country
        email
        level
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateReferee = /* GraphQL */ `
  subscription OnCreateReferee {
    onCreateReferee {
      id
      firstName
      lastName
      country
      email
      level
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateReferee = /* GraphQL */ `
  subscription OnUpdateReferee {
    onUpdateReferee {
      id
      firstName
      lastName
      country
      email
      level
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteReferee = /* GraphQL */ `
  subscription OnDeleteReferee {
    onDeleteReferee {
      id
      firstName
      lastName
      country
      email
      level
      createdAt
      updatedAt
    }
  }
`;
