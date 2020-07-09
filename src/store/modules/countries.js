const countryObj = require("../../assets/countries.json");
const countryList = Object.getOwnPropertyNames(countryObj).map(
  key => countryObj[key]
).sort();

const state = {
  countries: countryList,
};

const countries = {
  namespaced: true,
  state,
  getters: {
    all: state => state.countries,
    byName: (state) => (name) => {
      const all = state.countries;
      return name == "" ? all : all.filter(
        country => country.toLowerCase().includes(name.toString().toLowerCase())
      )
    }
  }
};
export default countries;