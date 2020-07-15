<template>
    <b-collapse 
      v-bind:open="open"
      aria-id="newEntryForm" 
      animation="slide" 
      class="card"
    >
        <div 
            slot="trigger" 
            slot-scope="props"
            class="card-header"
            role="button"
        >
            <span class="card-header-title">
                <span v-if="tournament.id">Edit tournament</span>
                <span v-else>Add new tournament</span>
            </span>
            <a class="card-header-icon">
                <b-icon
                    :icon="props.open ? 'menu-down' : 'menu-up'">
                </b-icon>
            </a>
        </div>
        <div class="card-content">
          <div class="columns">
              <div class="column is-half is-full-tablet">
                  <div class="field">
                    <div class="columns">
                      <div class="column is-half is-full-tablet">
                        <b-field label="Name of tournament" label-position="on-border">
                          <b-input v-model="tournament.name" :required="true" :expanded="true"></b-input>
                        </b-field>
                      </div>
                      <div class="column is-half is-full-tablet">
                        <b-field>
                         <b-radio-button v-model="tournament.international" :native-value="true" expanded>
                              International
                          </b-radio-button>
                          <b-radio-button v-model="tournament.international" :native-value="false" expanded>
                              National
                          </b-radio-button>
                        </b-field>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                      <b-field label="Place of the tournament" label-position="on-border">
                          <b-input 
                              v-model="tournament.city"
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
                              @select="option => tournament.country = option"
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
                              v-model="tournament.dates"
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
                  <div class="field" id="td-field">
                      <b-field label="Technical Delegate TD">
                        <div class="columns">
                          <div class="column is-full" v-if="!tournament.td.id && !showAddTdForm">
                            <b-field>
                              <b-autocomplete
                                  v-model="tdQuery"
                                  placeholder="Search by name or email"
                                  :keep-first="true"
                                  :data="filteredTd"
                                  icon="magnify"
                                  expanded
                                  @select="option => tournament.td = option">
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
                              <b-button 
                                @click="tournament.td = getCurrent()" 
                                type="is-info" 
                                icon-left="account-plus" 
                                title="Set yourself as TD">
                              </b-button>
                            </b-field>
                          </div>
                          <div class="column is-half" v-if="tournament.td.id">
                              <b-tag 
                                size="is-medium" 
                                closable 
                                rounded
                                :key="tournament.td.id"
                                @close="tournament.td={}"
                            >
                                {{ tournament.td.firstName }} {{ tournament.td.lastName }}
                                &lt;{{tournament.td.email || "email-missing" }}&gt;
                            </b-tag>
                          </div>
                          <div  class="column is-half" v-if="tournament.td.id && !tournament.td.email">
                            <b-field >
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
                          </div>
                        </div>
                      </b-field>
                    <referee-form
                        v-if="showAddTdForm"
                        :onSave="addTd"
                        :onCancel="() => { showAddTdForm = false }"
                    >
                    </referee-form>
                  </div><!-- /td-field -->
                  
                  <div class="field" id="your-games">
                    <b-field label="Your Games">
                      <div class="columns">
                        <div class="column is-half">
                          <b-field label="As referee" label-position="on-border">
                            <b-numberinput 
                              controls-position="compact"
                              :controls-rounded="true"
                              v-model="noOfGames"
                              :min="0"
                              :max="20"
                            ></b-numberinput>
                          </b-field>
                        </div>
                        <div class="column is-half">
                          <b-field label="As table official / 10 sec timer" label-position="on-border">
                            <b-numberinput 
                              controls-position="compact"
                              :controls-rounded="true"
                              v-model="noOfTenSeconds"
                              :min="0"
                              :max="20"
                            ></b-numberinput>
                          </b-field>
                        </div>
                      </div>
                    </b-field>
                  </div><!-- /your-games -->
                  <div class="field" id="referees-field">
                      <b-field label="Referees">
                        <b-field v-if="!showAddRefereeForm">
                          <b-autocomplete
                              v-model="ref"
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
                      <b-field label="Add referee"  v-if="showAddRefereeForm" label-position="on-border">
                        <referee-form :onSave="addReferee" :onCancel="() => showAddRefereeForm = false" />
                      </b-field>
                      <div>
                          <b-tag 
                              v-for="ref in tournament.referees"
                              v-bind:key="ref.id"
                              size="is-medium" 
                              closable 
                              rounded
                              @close="removeReferee(ref)"
                          >
                              {{ ref.firstName }} {{ ref.lastName }} [{{ ref.country }}]
                          </b-tag>
                      </div>
                  </div><!-- /referees-field -->
                  <div class="field">
                      <b-field label="Teams competing (Name / Country)">
                          <b-taginput
                              v-model="tournament.teams"
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
                {{ tournament.id ? "Update" : "Save" }}
            </b-button>
            <b-button @click="handleCancel" type="is-light" icon-left="cancel" class="card-footer-item" >
                Cancel
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
  tournament: new Tournament({ id: null }),
  countryQuery: "",
  tdEmail: "",
  tdQuery: "",
  ref: "",
  noOfGames: 0,
  noOfTenSeconds: 0
};
export default {
    components: {
        RefereeForm,
    },
  props: {
    editable: {
      type: Boolean,
      default: true
    },
    selected: {
      type: String,
      default: null
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
      const today = new Date();
      return {
        ...defaults,
        tournament: new Tournament({ id: null }),
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
    loadWip() {
      const wip = this.$store.getters['tournaments/wip'];
      if (! wip) {
        return;
      }
      this.loadTournament(wip);
    },
    loadTournamentById(tournamentId) {
      const wip = this.$store.getters['tournaments/byId'](tournamentId);
      if (! wip) {
        return;
      }
      this.loadTournament(wip);
    },
    loadTournament(tournament) {
      this.tournament = new Tournament(tournament, this.$store.getters['referees/all']);
      this.countryQuery = tournament.country;
      const current = this.getCurrent();
      const { games = 0, tenSeconds = 0 } = tournament.referees.find(
        r => r.id == current.id
      ) || {};
      this.noOfGames = games;
      this.noOfTenSeconds = tenSeconds;
    },
    getRefereeById(id) {
      return this.$store.getters['referees/byId'](id);
    },
    handleSave() {
      if (this.noOfGames > 0 || this.noOfGames > 0) {
        const current = this.$store.getters["referees/current"];
        this.tournament.setGames(current.id, this.noOfGames, this.noOfTenSeconds);
      }
      if (this.tournament.id) {
        this.$buefy.toast.open({ message: "Updating... "});
        this.$store.dispatch("tournaments/update", { tournament: this.tournament });
      } else {
        this.$buefy.toast.open({ message: "Saving new tournament... "});
        this.$store.dispatch("tournaments/create", { tournament: this.tournament });
      }
      this.$router.push({ path: `/tournaments/${this.$route.params.year}` });
    },
    handleCancel() {
      this.$buefy.toast.open({
        message: "Cancelled",
        type: "is-warning"
      });
      this.$router.push({ path: `/tournaments/${this.$route.params.year}` });
    },
      selectReferee: function(referee) {
        if ( ! this.tournament.referees.find( r => r.id === referee.id)) {
          this.tournament.referees.push({ ...referee, games: 0, tenSeconds: 0 });
        }
      },
      removeReferee: function (referee) {
          let index = this.tournament.referees.findIndex( ref => ref.id === referee.id );
          if (index >= 0) {
              this.tournament.referees.splice(index, 1);
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
          this.tournament.td = referee;
          this.showAddTdForm = false;
          this.tdQuery = "";
          this.$buefy.toast.open({
            message: `${referee.firstName} ${referee.lastName} added as TD`,
            type: 'is-success'
          })
      },
      handleSaveTdEmail() {
        this.tournament.td.email = this.tdEmail;
        this.$buefy.toast.open({ message: "Updating..." });
        this.$store.dispatch("referees/update", { referee: this.tournament.td });
        this.tdEmail = "";
      }
  },
  watch: {
    noOfGames: function() {
      if (this.noOfGames > 0 || this.noOfTenSeconds > 0) {
        this.addCurrent();
      }
    },
    noOfTenSeconds: function() {
      if (this.noOfGames > 0 || this.noOfTenSeconds > 0) {
        this.addCurrent();
      }
    }
  },
  mounted() {
    if(this.existingTeams.length == 0) {
      let existingTeams = this.$store.getters['tournaments/teams'] || [];
      this.existingTeams = existingTeams;
      this.filteredTeams = existingTeams;
    }
    if (this.selected) {
      this.loadTournamentById(this.selected);
    }
    const currentUser = this.$store.getters["auth/user"];
    const referee = this.$store.getters["referees/byUserId"](currentUser.username);
    if (referee) {
      this.$store.dispatch("referees/setCurrent", { referee });
    }
  },
}
</script>