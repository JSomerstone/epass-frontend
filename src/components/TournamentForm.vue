<template>
    <b-collapse 
      v-bind:open="showForm" 
      aria-id="newEntryForm" 
      animation="slide" 
      class="card"
      @open="setShow(true)"
      @close="setShow(false)"
    >
        <div 
            slot="trigger" 
            slot-scope="props"
            class="card-header"
            role="button"
        >
            <span class="card-header-title">
                <span v-if="id">Edit tournament: {{ name }}</span>
                <span v-else>Add tournament to your ePass</span>
            </span>
            <a class="card-header-icon">
                <b-icon
                    :icon="props.open ? 'menu-down' : 'menu-up'">
                </b-icon>
            </a>
        </div>
        <div class="card-content">
            <form>
                <div class="columns">
                    <div class="column is-half is-full-tablet">
                        <div class="field">
                            <b-field label="Name of tournament" label-position="on-border">
                                <b-input v-model="name" :required="true" :expanded="true"></b-input>
                                <b-radio-button v-model="type" native-value="international" >
                                    International
                                </b-radio-button>
                                <b-radio-button v-model="type" native-value="national" >
                                    National
                                </b-radio-button>
                            </b-field>
                        </div>
                        <div class="field">
                            <b-field label="Place of the tournament" label-position="on-border">
                                <b-input 
                                    v-model="city"
                                    :required="true" 
                                    placeholder="City" 
                                    :expanded="true"
                                    icon="city"
                                ></b-input>
                                <b-autocomplete
                                    v-model="countryQuery"
                                    placeholder="Country"
                                    icon="earth"
                                    :keep-first="true"
                                    :data="getCountries(countryQuery)"
                                    :expanded="true"
                                    @select="option => country = option"
                                >
                                </b-autocomplete>
                            </b-field>
                        </div>
                        <div class="field">
                            <b-field label="Dates" label-position="on-border">
                                <b-datepicker
                                    icon="calendar-today"
                                    trap-focus
                                    range
                                    inline
                                    v-model="dates"
                                    placeholder="Pick tournament dates"
                                    :required="true"
                                    :min-date="minDate"
                                    :max-date="maxDate"
                                    :first-day-of-week="1"
                                >
                                </b-datepicker>
                            </b-field>
                        </div>
                    </div>
                    <div class="column is-half is-full-tablet">
                       <div class="field">
                            <b-field label="Technical Delegate TD" label-position="on-border">
                                <b-autocomplete
                                    v-if="!td.id && !showAddTdForm"
                                    v-model="tdQuery"
                                    placeholder="Search by name or email"
                                    :keep-first="true"
                                    :data="filteredTd"
                                    icon="magnify"
                                    @select="option => td = option">
                                >
                                    <template slot-scope="props">
                                        {{ props.option.firstName }} {{ props.option.lastName }} [{{ props.option.country }}]
                                    </template>
                                    <template slot="empty">
                                        <a @click="showAddTdForm = true" title="">
                                            <b-icon icon="account-plus"></b-icon>
                                            Add TD...
                                        </a>
                                    </template>
                                </b-autocomplete>
                                <b-tag 
                                    v-if="td.id"
                                    size="is-medium" 
                                    closable 
                                    rounded
                                    :key="td.email"
                                    @close="td={}"
                                >
                                    {{ td.firstName }} {{ td.lastName }} &lt;{{td.email || "email-missing" }}&gt;
                                </b-tag>
                                <b-field v-if="td.id && !td.email">
                                  <b-input 
                                    v-model="tdEmail"
                                    type="email"
                                    placeholder="Add missing email"
                                    :expanded="true"
                                  ></b-input>
                                  <b-button 
                                    type="is-info"
                                    icon-left="email-check-outline"
                                    title="Save email"
                                    @click="handleSaveTdEmail"
                                  ></b-button>
                                </b-field>
                            </b-field>

                        </div>
                        <referee-form
                            v-if="showAddTdForm"
                            :onSave="addTd"
                            :onCancel="() => { showAddTdForm = false }"
                        >
                        </referee-form>
                        <div class="field">
                          <b-field label="Your Games">
                            <b-field grouped :expanded="true">
                              <b-field label="As referee" label-position="on-border">
                                  <b-numberinput 
                                    controls-position="compact"
                                    :controls-rounded="true"
                                    v-model="noOfGames"
                                    :min="0"
                                    :max="20"
                                  ></b-numberinput>
                              </b-field>
                              <b-field label="As table official / 10 sec timer" label-position="on-border">
                                  <b-numberinput 
                                    controls-position="compact"
                                    :controls-rounded="true"
                                    v-model="noOfTenSeconds"
                                    :min="0"
                                    :max="20"
                                  ></b-numberinput>
                              </b-field>
                            </b-field>
                          </b-field>
                        </div>
                            <div class="field">
                                <b-field label="Referees">
                                  <b-field>
                                    <b-autocomplete
                                        v-model="ref"
                                        v-if="!showAddRefereeForm"
                                        placeholder="Search by name, email or nationality"
                                        :keep-first="true"
                                        icon="magnify"
                                        :data="filteredReferees"
                                        @select="selectReferee"
                                        :clear-on-select="true"
                                        :expanded="true"
                                    >
                                        <template slot-scope="props">
                                            {{ props.option.firstName }} {{ props.option.lastName }}, {{ props.option.country.toUpperCase() }}
                                        </template>
                                        <template slot="empty">
                                            No results for {{ref}}, 
                                            <a @click="showAddRefereeForm = true">
                                                <span> Add new... </span>
                                            </a>
                                        </template>
                                    </b-autocomplete>
                                    <b-button @click="addCurrent" type="is-info" icon-left="account-plus" title="Add yourself">
                                    </b-button>
                                  </b-field>
                                </b-field>
                                <referee-form
                                    v-if="showAddRefereeForm"
                                    :onSave="addReferee"
                                >
                                </referee-form>
                                <div>
                                    <b-tag 
                                        v-for="ref in referees"
                                        v-bind:key="ref.id"
                                        size="is-medium" 
                                        closable 
                                        rounded
                                        @close="removeReferee(ref)"
                                    >
                                        {{ ref.firstName }} {{ ref.lastName }} [{{ ref.country }}]
                                    </b-tag>
                                </div>
                            </div>
                            <div class="field">
                                <b-field label="Teams competing (Name / Country)">
                                    <b-taginput
                                        v-model="teams"
                                        :data="filteredTeams"
                                        autocomplete
                                        :keep-first="true"
                                        :allow-new="true"
                                        :clear-on-select="true"
                                        icon="flag-plus-outline"
                                        placeholder="Add team"
                                        @typing="getFilteredTeams"
                                        @add="newTeam"
                                        class="tag-list"
                                    >
                                    </b-taginput>
                                </b-field>
                            </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="card-footer">
            <b-button 
              @click="handleSave" 
              v-bind:disabled="isLoading" 
              icon-left="check-circle-outline" 
              type="is-primary" 
              class="card-footer-item" 
              outlined
            >
                {{ id ? "Update" : "Save" }}
            </b-button>
            <b-button @click="reset" type="is-light" icon-left="cancel" class="card-footer-item" >
                Reset
            </b-button>
        </div>
    </b-collapse>
</template>
<style lang="css" scoped>
.panel-block > form{
    margin: 24px;
}
</style>
<script>
import RefereeForm from "./RefereeForm";
import Tournament from "../store/models/Tournament";
const defaults = {
  id: "",
  name: "",
  type: "international",
  city: "",
  country: "",
  countryQuery: "",
  dates: [],
  td: {},
  tdEmail: "",
  tdQuery: "",
  referees: [],
  ref: "",
  teams: [],
  noOfGames: 0,
  noOfTenSeconds: 0
};
export default {
    components: {
        RefereeForm,
    },
  data: () => {
      const today = new Date();
      return {
        ...defaults,
        minDate: new Date(`${today.getFullYear()-1}-12-31`),
        maxDate: today,
        showAddTdForm: false,
        showAddRefereeForm: false,
        existingTeams: [],
        filteredTeams: [],
      }
  },
  computed: {
    isLoading() {
      return (this.$store.getters['tournaments/loading'] 
        || this.$store.getters['referees/loading']);
    },
    showForm: function() {
      return this.$store.getters['tournaments/showForm'];
    },
    wipId: function() {
      if (this.$store.getters['tournaments/hasWip']){
        const { id = null } = this.$store.getters['tournaments/wip'];
        return id;
      } else {
        return null;
      }
    },
        filteredReferees: function() {
            return this.$store.getters['referees/search'](this.ref);
        },
        filteredTd: function() {
            return this.$store.getters['referees/search'](this.tdQuery);
        },
        allTeams: function() {
            return this.$store.getters['tournaments/teams'] || [];
        }
  },
  methods: {
    setShow(show) {
      this.$store.dispatch("tournaments/setShowForm", { show });
    },
    loadWip() {
      const wip = this.$store.getters['tournaments/wip'];
      if (! wip) {
        return;
      }
      this.id = wip.id;
      this.name = wip.name;
      this.type = wip.international ? "international" : "national";
      this.city = wip.city;
      this.country = wip.country;
      this.countryQuery = wip.country;
      this.dates = wip.dates.map( d => new Date(d));
      this.td = this.getRefereeById(wip.td);
      this.referees = wip.referees.map(
        r => {
          const referee = this.getRefereeById(r.id)
          return { ...referee, ...r }
        }
      );
      this.teams = wip.teams;
      const current = this.$store.getters["referees/current"];
      const { games = 0, tenSeconds = 0 } = wip.referees.find( r => r.id == current.id);
      this.noOfGames = games;
      this.noOfTenSeconds = tenSeconds;
    },
    getRefereeById(id) {
      return this.$store.getters['referees/byId'](id);
    },
    handleSave() {
      const tournament = new Tournament(this.$data);
      if (this.noOfGames > 0 || this.noOfGames > 0) {
        const current = this.$store.getters["referees/current"];
        tournament.setGames(current.id, this.noOfGames, this.noOfTenSeconds);
      }
      if (this.id) {
        this.$buefy.toast.open({ message: "Updating... "});
        this.$store.dispatch("tournaments/update", { tournament });
      } else {
        this.$buefy.toast.open({ message: "Saving new tournament... "});
        this.$store.dispatch("tournaments/create", { tournament });
      }
      Object.assign(this, defaults);
      this.setShow(false);
    },
    reset() {
      Object.assign(this, defaults);
      this.$store.dispatch('tournaments/openForEdit', { tournament: null });
      this.setShow(false);
      this.$buefy.toast.open({
        message: "Cancelled",
        type: "is-warning"
      });
    },
      selectReferee: function(referee) {
          if ( ! this.referees.find( r => r.id === referee.id)) {
              this.referees.push({ ...referee, games: 0, tenSeconds: 0 });
          }
      },
      removeReferee: function (referee) {
          let index = this.referees.findIndex( ref => ref.id === referee.id );
          if (index >= 0) {
              this.referees.splice(index, 1);
          }
      },
    addCurrent() {
      const current = this.getCurrent();
      current && this.selectReferee(current);
    },
    getCurrent() {
      return this.$store.getters["referees/current"];
    },
      getFilteredTeams: function(text) {
        this.filteredTeams = this.existingTeams.filter((option) => {
                return option
                    .toString()
                    .toLowerCase()
                    .indexOf(text.toLowerCase()) >= 0
            })
        },
        getCountries: function(name) {
            return name 
                ? this.$store.getters['countries/byName'](name)
                : [];
        },
      newTeam: function(team) {
            let existing = this.existingTeams.find( 
              t => t.toString().toLowerCase() === team.toLowerCase()
            );
            if ( ! existing) {
                this.$store.dispatch("tournaments/addTeam", { team } );
            }
      },
      addReferee: function(referee) {
          this.$store.dispatch("referees/create", { referee });
          this.selectReferee(referee);
          this.showAddRefereeForm = false;
          this.ref = "";
          this.$buefy.toast.open({
            message: `${referee.firstName} ${referee.lastName} added as referee`,
            type: 'is-success'
          });
      },
      addTd: function(referee) {
          this.$store.dispatch("referees/create", { referee });
          this.td = referee;
          this.showAddTdForm = false;
          this.tdQuery = "";
          this.$buefy.toast.open({
            message: `${referee.firstName} ${referee.lastName} added as TD`,
            type: 'is-success'
          })
      },
      handleSaveTdEmail() {
        this.td.email = this.tdEmail;
        this.$buefy.toast.open({ message: "Updating..." });
        this.$store.dispatch("referees/update", { referee: this.td });
        this.tdEmail = "";
      }
  },
  watch: {
    wipId: function(wip) {
      console.log('hasWip changed', wip);
      if (wip) {
        this.loadWip();
      }
    }
  },
  mounted() {
    if(this.existingTeams.length == 0) {
      let existingTeams = this.$store.getters['tournaments/teams'] || [];
      this.existingTeams = existingTeams;
      this.filteredTeams = existingTeams;
    }
  },
}
</script>