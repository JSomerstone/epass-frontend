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
      clinic {
        date
        conductor
      }
      associationId
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
      clinic {
        date
        conductor
      }
      associationId
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
      clinic {
        date
        conductor
      }
      associationId
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
  }
`;
export const createAssociation = /* GraphQL */ `
  mutation CreateAssociation(
    $input: CreateAssociationInput!
    $condition: ModelAssociationConditionInput
  ) {
    createAssociation(input: $input, condition: $condition) {
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
export const updateAssociation = /* GraphQL */ `
  mutation UpdateAssociation(
    $input: UpdateAssociationInput!
    $condition: ModelAssociationConditionInput
  ) {
    updateAssociation(input: $input, condition: $condition) {
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
export const deleteAssociation = /* GraphQL */ `
  mutation DeleteAssociation(
    $input: DeleteAssociationInput!
    $condition: ModelAssociationConditionInput
  ) {
    deleteAssociation(input: $input, condition: $condition) {
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
