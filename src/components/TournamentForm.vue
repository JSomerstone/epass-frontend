<template>
    <b-collapse 
      v-bind:open="open"
      aria-id="newEntryForm" 
      animation="slide" 
      class="card"
      :key="t.id"
    >
        <div 
            slot="trigger" 
            slot-scope="props"
            class="card-header"
            role="button"
        >
            <span class="card-header-title">
                <span v-if="t.id">Edit tournament</span>
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
              <div class="column is-half">
                  <div class="field">
                    <div class="columns">
                      <div class="column is-half">
                        <b-field label="Name of tournament" label-position="on-border">
                          <b-input v-model="t.name" :required="true" :expanded="true"></b-input>
                        </b-field>
                      </div>
                      <div class="column is-half">
                        <b-field>
                         <b-radio-button v-model="t.international" :native-value="true" expanded>
                              International
                          </b-radio-button>
                          <b-radio-button v-model="t.international" :native-value="false" expanded>
                              National
                          </b-radio-button>
                        </b-field>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                      <b-field label="Place of the tournament" label-position="on-border">
                          <b-input 
                              v-model="t.city"
                              :required="true" 
                              placeholder="City" 
                              :expanded="true"
                              icon="city"
                          ></b-input>
                          <country-autocomplete
                              v-model="t.country"
                              placeholder="Country"
                              icon="earth"
                              expanded
                          >
                          </country-autocomplete>
                      </b-field>
                  </div>
                  <div class="field">
                      <b-field label="Dates" label-position="on-border">
                          <b-datepicker
                            icon="calendar-today"
                            trap-focus
                            range
                            inline
                            v-model="t.dates"
                            placeholder="Pick tournament dates"
                            :required="true"
                            :min-date="minDate"
                            :max-date="maxDate"
                            :first-day-of-week="1"
                             @input="onDateChange" 
                          >
                          </b-datepicker>
                      </b-field>
                  </div>
              </div>
              <div class="column is-half">
                  <div class="field" id="td-field">
                      <b-field label="Tournament Director / TD">
                        <div class="columns">
                          <div class="column is-full" v-if="!t.td.id && !showAddTdForm">
                            <b-field>
                              <b-autocomplete
                                  v-model="tdQuery"
                                  placeholder="Search by name or email"
                                  :keep-first="true"
                                  :data="filteredTd"
                                  icon="magnify"
                                  expanded
                                  @select="option => t.td = option">
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
                                @click="t.td = getCurrent()" 
                                type="is-info" 
                                icon-left="account-plus" 
                                title="Set yourself as TD">
                              </b-button>
                            </b-field>
                          </div>
                          <div class="column is-half" v-if="t.td.id">
                              <b-tag 
                                size="is-medium" 
                                :closable="userIsTd() || !t.id"
                                rounded
                                :key="t.td.id"
                                @close="confirmRemoveTd"
                            >
                                {{ t.td.firstName }} {{ t.td.lastName }}
                                &lt;{{t.td.email || "email-missing" }}&gt;
                            </b-tag>
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
                                  {{ props.option.firstName }} {{ props.option.lastName }} [{{ props.option.country }}]
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
                        <b-field label="Add referee"
                          class="referee-form" 
                          v-if="showAddRefereeForm"
                        >
                          <referee-form
                            :onSave="addReferee"
                            :onCancel="() => showAddRefereeForm = false"
                          />
                        </b-field>
                      </b-field>
                      <referee-table 
                        v-model="t.referees"
                        :editableItem="getEditableReferee()"
                      />
                  </div><!-- /referees-field -->
                <div class="field"><!-- teams-field -->
                  <b-field label="Teams competing">
                    <teams-field v-model="t.teams" />
                  </b-field>
                </div><!-- /teams-field -->
              </div>
            </div>
        </div>
        <div class="card-footer" v-if="editable">
            <b-button 
              @click="handleSave" 
              v-bind:disabled="isLoading || !t.isValid()"
              icon-left="check-circle-outline" 
              type="is-primary" 
              class="card-footer-item" 
              outlined
            >
                {{ t.id ? "Update" : "Save" }}
            </b-button>
            <b-button @click="handleCancel" type="is-light" icon-left="cancel" class="card-footer-item" >
                Cancel
            </b-button>
            <b-button @click="handleFill" v-if="debug">
              Fill
            </b-button>
        </div>
        <pre v-if="debug">{{ t }}</pre>
    </b-collapse>
</template>
<style lang="css" scoped>
.panel-block > form{
    margin: 24px;
}

.referee-form {
  padding: 20px;
}
</style>
<script>
import RefereeForm from "./RefereeForm";
import RefereeTable from "./EditableRefereeTable";
import TeamsField from "./TeamsField";
import CountryAutocomplete from "./field/CountryAutocomplete";
import Tournament from "../store/models/Tournament";
import { infoMessage, warningMessage } from "../utils/notificationUtils";

const defaults = {
  countryQuery: "",
  tdQuery: "",
  ref: "",
};
export default {
  components: {
    TeamsField,
    RefereeForm,
    RefereeTable,
    CountryAutocomplete,
  },
  props: {
    editable: {
      type: Boolean,
      default: true
    },
    tournament: {
      type: Object,
      default: () => new Tournament(),
    },
    open: {
      type: Boolean,
      default: false
    },
    year: {
      type: Number,
      default: new Date().getFullYear()
    }
  },
  data(){
    return {
      ...defaults,
      t: new Tournament({year: this.year }),
      minDate: new Date(`${this.year-1}-01-01`),
      maxDate: new Date(`${this.year+1}-12-31`),
      showAddTdForm: false,
      showAddRefereeForm: false,
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
    allReferees: function() {
        return this.$store.getters['referees/all'] || [];
    },
    debug: function() {
      return this.$store.getters["tournaments/debug"];
    }
  },
  methods: {
    loadTournamentForm(tournament) {
      this.t = new Tournament(tournament, this.$store.getters['referees/all']);
      this.countryQuery = tournament.country;
    },
    getRefereeById(id) {
      return this.$store.getters['referees/byId'](id);
    },
    onDateChange(value) {
      this.t.year = value[0].getFullYear();
    },
    handleSave() {
      if (this.t.id) {
        infoMessage("Updating...");
        this.$store.dispatch("tournaments/update", { tournament: this.t });
      } else {
        infoMessage("Saving...");
        this.$store.dispatch(
          "tournaments/create", 
          { tournament: this.t, onSuccess: (saved) => this.t.id = saved.id }
        );
      }
    },
    handleCancel() {
      if (this.t.id) {
        this.$router.push({
          name: 'tournaments',
          params: { year: this.year }
        });
      } else {
        this.loadTournamentForm(new Tournament({year: this.year }))
      }
      warningMessage("Cancelled");
    },
    confirmRemoveTd() {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to remove the TD?',
        onConfirm: () => { this.t.td = {}; }
      });
    },
      selectReferee: function(referee) {
        if ( ! this.t.referees.find( r => r.id === referee.id)) {
          this.t.referees.push({ ...referee, games: 0, tenSeconds: 0 });
        }
      },
      removeReferee: function (referee) {
          let index = this.t.referees.findIndex( ref => ref.id === referee.id );
          if (index >= 0) {
              this.t.referees.splice(index, 1);
          }
      },
    addCurrent() {
      const current = this.getCurrent();
      current.id && this.selectReferee(current);
    },
    getCurrent() {
      return this.$store.getters["referees/current"] || {};
    },
    userIsTd() {
      const { id = null } = this.getCurrent();
      return id == this.t.td.id;
    },
    getEditableReferee() {
      const { id = null } = this.getCurrent();
      return this.userIsTd() //If user is the TD of the tournament -> "all"
        ? "all"
        : id || "none"; //Otherwise only the current users' own stats
    },
    addReferee: function(referee) {
        this.$store.dispatch("referees/create", { 
          referee,
          onSuccess: this.selectReferee
        });
        this.showAddRefereeForm = false;
        this.ref = "";
    },
    addTd: function(referee) {
        this.$store.dispatch("referees/create", { 
          referee,
          onSuccess: (td) => { this.t.td = td; } 
        });
        this.showAddTdForm = false;
        this.tdQuery = "";
    },
    handleFill() {
      this.t = new Tournament({
        name: "Test tournament",
        year: 2020,
        city: "Helsinki",
        country: "Finland",
        dates: ["2020-07-16","2020-07-16"],
        td: this.getCurrent(),
        referees: [
          {
            "id": "e901993c-6021-4533-bae3-6a171726517d",
            "games": 0,
            "tenSeconds": 0
          },
          {
            "id": "024a1a55-16cc-4b86-8fbf-0441daa30b22",
            "games": 0,
            "tenSeconds": 0
          }
        ],
        teams: this.$store.getters['tournaments/teams']
      }, this.allReferees);
      this.countryQuery = this.t.country;
      this.noOfTenSeconds = 10;
      this.noOfGames = 6;
    },
  },
  watch: {
    tournament: function(tournament) {
      setTimeout(
        () => this.loadTournamentForm(tournament),
        500
      );
    }
  },
}
</script>