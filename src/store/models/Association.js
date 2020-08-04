export default class Association {
  constructor(rawData = {}) {
    const {
      id = null,
      name = "",
      address = "",
      country = "",
      email = "",
      coordinatorEmail = "",
      coordinator = "",
    } = rawData;

    this.id = id;
    this.name = name;
    this.address = address;
    this.country = country;
    this.email = email;
    this.coordinatorEmail = coordinatorEmail;
    this.coordinator = coordinator;
  }
}
