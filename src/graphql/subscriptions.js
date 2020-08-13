/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateReferee = /* GraphQL */ `
  subscription OnCreateReferee {
    onCreateReferee {
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
export const onUpdateReferee = /* GraphQL */ `
  subscription OnUpdateReferee {
    onUpdateReferee {
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
export const onDeleteReferee = /* GraphQL */ `
  subscription OnDeleteReferee {
    onDeleteReferee {
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
export const onCreateTournament = /* GraphQL */ `
  subscription OnCreateTournament {
    onCreateTournament {
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
export const onUpdateTournament = /* GraphQL */ `
  subscription OnUpdateTournament {
    onUpdateTournament {
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
export const onDeleteTournament = /* GraphQL */ `
  subscription OnDeleteTournament {
    onDeleteTournament {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
      id
      tournament {
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
          nextToken
        }
        createdAt
        updatedAt
      }
      refereeID
      created
      message
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
      id
      tournament {
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
          nextToken
        }
        createdAt
        updatedAt
      }
      refereeID
      created
      message
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
      id
      tournament {
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
          nextToken
        }
        createdAt
        updatedAt
      }
      refereeID
      created
      message
      createdAt
      updatedAt
    }
  }
`;
export const onCreateAssociation = /* GraphQL */ `
  subscription OnCreateAssociation {
    onCreateAssociation {
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
export const onUpdateAssociation = /* GraphQL */ `
  subscription OnUpdateAssociation {
    onUpdateAssociation {
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
export const onDeleteAssociation = /* GraphQL */ `
  subscription OnDeleteAssociation {
    onDeleteAssociation {
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
