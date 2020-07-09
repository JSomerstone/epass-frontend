<template>
    <b-collapse :open="true" aria-id="newEntryForm" animation="slide" class="card">
        <div 
            slot="trigger" 
            slot-scope="props"
            class="card-header"
            role="button"
        >
            <span class="card-header-title">
                Add tournament to your ePass
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
                                <b-input v-bind="name" :required="true" :expanded="true"></b-input>
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
                                    v-model="dates"
                                    placeholder="Pick tournament dates"
                                    :date-formatter="formatDate"
                                    :required="true"
                                    :min-date="minDate"
                                    :max-date="maxDate"
                                >
                                </b-datepicker>
                            </b-field>
                        </div>
                        <div class="field">
                            <b-field label="Technical Delegate TD" label-position="on-border">
                                <b-autocomplete
                                    v-if="!td && !showAddTdForm"
                                    v-model="tdQuery"
                                    placeholder="Search by name or email"
                                    :keep-first="true"
                                    :data="filteredTd"
                                    icon="magnify"
                                    @select="option => td = option">
                                >
                                    <template slot-scope="props">
                                        {{ props.option.firstName }} {{ props.option.lastName }}, {{ props.option.country.toUpperCase() }}
                                    </template>
                                    <template slot="empty">
                                        <a @click="showAddTdForm = true" title="">
                                            <b-icon icon="account-plus"></b-icon>
                                            Add TD...
                                        </a>
                                    </template>
                                </b-autocomplete>
                                <b-tag 
                                    v-if="td"
                                    size="is-medium" 
                                    closable 
                                    rounded
                                    @close="td=null"
                                >
                                    {{ td.firstName }} {{ td.lastName }} &lt;{{td.email || "email-missing" }}&gt;
                                </b-tag>
                                
                            </b-field>

                        </div>
                        <referee-form
                            v-if="showAddTdForm"
                            :onSave="addTd"
                        >
                        </referee-form>
                        <div class="field">
                            <b-field label="Games as referee" label-position="on-border">
                                <b-numberinput controls-position="compact" v-model="noOfGames"></b-numberinput>
                            </b-field>
                            <b-field label="Games as table official / 10 sec timer" label-position="on-border">
                                <b-numberinput controls-position="compact" v-model="noOfTenSeconds"></b-numberinput>
                            </b-field>
                        </div>
                    </div>
                    <div class="column is-half is-full-tablet">
                            <div class="field">
                                <b-field label="Other referees">
                                    <b-autocomplete
                                        v-model="ref"
                                        v-if="!showAddRefereeForm"
                                        placeholder="Search by name, email or nationality"
                                        :keep-first="true"
                                        icon="magnify"
                                        :data="filteredReferees"
                                        @select="selectReferee"
                                        :clear-on-select="true"
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
            <button @click="handleSave" class="button is-primary is-outlined card-footer-item">
                Save
            </button>
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

export default {
    components: {
        RefereeForm,
    },
  data: () => {
      const today = new Date()
      return {
          name: "",
          type: "international",
          city: "",
          country: "",
          countryQuery: "",
          minDate: new Date(today.getFullYear(), 1, 1),
          maxDate: today,
          dates: [],
          tdQuery: "",
          td: null,
          showAddTdForm: false,
          ref: "",
          referees: [],
          showAddRefereeForm: false,
          teams: [],
          existingTeams: [],
          filteredTeams: [],
          noOfGames: 0,
          noOfTenSeconds: 0,
      }
  },
  computed: {
        allValid: function() {
            return false;
        },
        filteredReferees: function() {
            return this.$store.getters['referees/search'](this.ref);
        },
        filteredTd: function() {
            return this.$store.getters['referees/search'](this.tdQuery);
        },
        allTeams: function() {
            return this.$store.getters['tournaments/teams'] || [];
        },
        formatDate: () => dates => {
            if (dates.length == 2) {
                let formatted = [
                    dates[0].toISOString().split("T").shift()
                ];
                if (dates[0] !== dates[1]) {
                    formatted.push(
                        dates[1].toISOString().split("T").shift()
                    )
                }
                return formatted.join(" - ");
            }
        }
  },
  methods: {
    handleSave() {
      const tournament = new Tournament(this.$data);
      if (this.noOfGames > 0 || this.noOfGames > 0) {
        const current = this.$store.getters["referees/current"];
        this.selectReferee(current);
        tournament.setGames(current.id, this.noOfGames, this.noOfTenSeconds);
      }
      const result = this.$store.dispatch("tournaments/create", { tournament });
      this.$buefy.toast.open({
        message: result.message,
        type: `is-${result.type}`
      });
    },
    reset() {
      this.$forceUpdate();
    },
      selectReferee: function(referee) {
          if ( ! this.referees.find( r => r.id === referee.id)) {
              this.referees.push({ ...referee, games: 0, tenSeconds: 0 });
          }
      },
      removeReferee: function (referee) {
          let index = this.referees.findIndex( ref => ref.id === referee.id );
          if (index) {
              this.referees.splice(index, 1);
          }
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
      }
  },
  mounted() {
      let existingTeams = this.$store.getters['tournaments/teams'] || [];
      this.existingTeams = existingTeams;
      this.filteredTeams = existingTeams;
  },
}
</script>