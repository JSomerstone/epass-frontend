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
            class="card-header"
            role="button"
        >
            <span class="card-header-title">
                <span v-if="t.id">Edit tournament</span>
                <span v-else>Add new tournament</span>
            </span>
            <a class="card-header-icon">
                <b-icon
                    :icon="open ? 'menu-down' : 'menu-up'">
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
                          <b-input v-model="t.name" :required="true" :expanded="true" :disabled="disabled"></b-input>
                        </b-field>
                      </div>
                      <div class="column is-half">
                        <b-field>
                         <b-radio-button v-model="t.international" :native-value="true" expanded :disabled="disabled">
                              International
                          </b-radio-button>
                          <b-radio-button v-model="t.international" :native-value="false" expanded :disabled="disabled">
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
                              :disabled="disabled"
                          ></b-input>
                          <country-autocomplete
                              v-model="t.country"
                              placeholder="Country"
                              icon="earth"
                              expanded
                              v-if="!disabled"
                          >
                          </country-autocomplete>
                          <b-input v-model="t.country" disabled v-else expanded icon="earth" />
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
                            :disabled="disabled"
                          >
                          </b-datepicker>
                      </b-field>
                  </div>
                  <div class="field">
                    <label class="label">
                      <b-button 
                        :icon-right="showNotes ? 'menu-down' : 'menu-up'" 
                        @click="showNotes = !showNotes" 
                        type="is-text"
                      >Notes ({{ notes.length }})
                      </b-button>
                    </label>
                    <div class="notes" v-if="notes.length && showNotes">
                      <b-message v-for="(note, index) in notes" :key="index" class="note">
                        <i>{{ note.refereeID | refereeName(allReferees) }}, {{ note.created | datetime }}:</i>
                        <b-tooltip label="Delete note">
                          <b-button 
                            size="small" 
                            type="is-text" 
                            icon-left="close"
                            v-if="note.refereeID == referee.id"
                            @click="handleRemoveComment(note, index)"
                            class="remove-comment-btn"
                          />
                        </b-tooltip>
                        <pre>{{ note.message }}</pre>
                      </b-message>
                    </div>
                    <b-field label="Add a note" label-position="on-border" >
                      <b-input 
                        v-model="comment" 
                        type="textarea"
                        placeholder="Type a message"
                        :rows="commentFieldRows"
                        maxlength="256"
                        has-counter
                        expanded
                        ref="noteField"
                      />
                      <b-button 
                        icon-left="comment-text-outline" 
                        type="is-info"
                        :disabled="isLoading"
                        @click="handleAddComment"
                        class="add-note-btn"
                      >Add note
                      </b-button>
                    </b-field>
                    <pre v-if="debug">{{ notes.map( n => n.created ) }}</pre>
                  </div>
              </div>
              <div class="column is-half">
                  <div class="field" id="td-field">
                      <b-field label="Tournament Director / TD">
                        <div class="columns">
                          <div class="column is-full" v-if="!t.td.id">
                            <b-field>
                              <b-autocomplete
                                  v-model="tdQuery"
                                  placeholder="Search by name or email"
                                  :keep-first="true"
                                  :data="filteredTd"
                                  icon="magnify"
                                  expanded
                                  :disabled="disabled"
                                  @select="option => t.td = option">
                              >
                                  <template slot-scope="props">
                                      {{ props.option.firstName }} {{ props.option.lastName }} [{{ props.option.country }}]
                                  </template>
                                  <template slot="empty">
                                      <a @click="openAddTdForm">
                                          <b-icon icon="account-plus"></b-icon>
                                          Add TD...
                                      </a>
                                  </template>
                              </b-autocomplete>
                              <b-tooltip label="Set yourself as the TD" type="is-info" v-if="isAdmin">
                                <b-button 
                                  @click="t.td = referee" 
                                  type="is-info" 
                                  icon-left="account-circle-outline" 
                                  title="Set yourself as TD">
                                </b-button>
                              </b-tooltip>
                            </b-field>
                          </div>
                          <div class="column is-half" v-if="t.td.id">
                              <b-tag 
                                size="is-medium" 
                                :closable="isAdmin"
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
                  </div><!-- /td-field -->
                  
                  <div class="field" id="referees-field">
                    <b-field label="Referees" />
                      <referee-table
                        v-model="t.referees"
                        :editableItem="getEditableReferee()"
                        :editable="!disabled"
                      />
                      <b-field v-if="!disabled" label="Add referee" label-position="on-border" >
                        <b-autocomplete
                            v-model="ref"
                            ref="refereeField"
                            placeholder="Search by name, email or nationality"
                            :keep-first="true"
                            icon="magnify"
                            :data="filteredReferees"
                            @select="selectReferee"
                            :clear-on-select="true"
                            :expanded="true"
                            :disabled="disabled"
                        >
                          <!-- TODO: Hide country if not present -->
                            <template slot-scope="props">
                                {{ props.option.firstName }} {{ props.option.lastName }} [{{ props.option.country }}]
                            </template>
                            <template slot="empty">
                                No results for {{ref}}
                                <b-button @click="openAddRefereeForm" icon-left="account-plus" type="is-text">
                                  New referee
                                </b-button> 
                            </template>
                        </b-autocomplete>
                        <b-tooltip label="Add new referee to system" type="is-info">
                          <b-button @click="openAddRefereeForm" icon-left="account-plus" type="is-info" outlined>
                            New referee
                          </b-button>
                        </b-tooltip>
                        <b-tooltip label="Add yourself as a referee"  type="is-info" v-if="!isReferee && !locked">
                          <b-button @click="addCurrent" icon-left="account-circle-outline" type="is-info"/>
                        </b-tooltip>
                      </b-field>
                  </div><!-- /referees-field -->
                <div class="field"><!-- teams-field -->
                  <b-field label="Teams competing">
                    <teams-field v-model="t.teams" :editable="!disabled" />
                  </b-field>
                </div><!-- /teams-field -->
              </div>
            </div>
            <div v-if="t.locked">
              <strong><b-icon icon="lock" /> Tournament is locked</strong>
              <b-tooltip label="Unlock to allow modifications" type="is-warning">
                <b-button type="is-text" @click="toggleLock" v-if="locked && isAdmin" icon-right="lock-open-variant">
                  Unlock
                </b-button>
              </b-tooltip>
            </div>
            <div class="tournament-meta" v-if="t.createdBy">
              Created by {{ t.createdBy | refereeName(allReferees) }} at {{ t.createdAt | date }}.
              Last update: {{ t.updatedAt | date }}.
            </div>
            <pre v-if="debug">{{ { disabled, editable, locked, isNew, isReferee, isAdmin } }}</pre>
        </div>
        <div class="card-footer" v-if="editable && !locked">
            <b-button 
              @click="handleSave" 
              :disabled="isLoading || !t.isValid() || disabled"
              icon-left="check-circle-outline" 
              type="is-primary" 
              class="card-footer-item"
              outlined
              ref="saveBtn"
            >
                {{ t.id ? "Update" : "Save" }}
            </b-button>
            <b-button @click="handleCancel" type="is-light" icon-left="cancel" class="card-footer-item" ref="cancelBtn">
                Cancel
            </b-button>
            <b-dropdown aria-role="list" v-if="t.id && isAdmin">
              <b-tooltip label="More actions" slot="trigger" slot-scope="{ active }">
                <button class="button is-primary" outlined >
                  <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                </button>
              </b-tooltip>
              <b-dropdown-item aria-role="listitem">
                <b-button 
                  @click="toggleLock"
                  type="is-warning" 
                  icon-left="lock"
                  ref="lockBtn"
                >Lock tournament
                </b-button>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                  <b-button 
                    @click="handleDelete" 
                    type="is-danger" 
                    icon-left="delete" 
                    ref="deleteBtn"
                    outlined
                  >Delete tournamet</b-button>
              </b-dropdown-item>
            </b-dropdown>
        </div>
        <pre v-if="debug">{{ t }}</pre>
    </b-collapse>
</template>
<style lang="css">
.panel-block > form{
    margin: 24px;
}
.referee-form {
  padding: 20px;
}
.notes .media-content pre {
  padding: 0em 0em 0em 1em;
  overflow-x: auto;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.notes .message.note .message-body {
  padding: 0.25em 0.5em;
}
.note:last-child, .referee-table {
  margin-bottom: 1.5rem;
}
.tournament-meta {
  font-size: smaller;
}
</style>
<script>
import RefereeTable from "./EditableRefereeTable";
import TeamsField from "./TeamsField";
import CountryAutocomplete from "./field/CountryAutocomplete";
import RefereeModal from "./modal/NewRefereeModal";
import Tournament from "../store/models/Tournament";
import Comment from "../store/models/Comment";
import { infoMessage, warningMessage } from "../utils/notificationUtils";

const defaults = {
  countryQuery: "",
  tdQuery: "",
  ref: "",
  comment: "",
  showNotes: false,
};
export default {
  components: {
    TeamsField,
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
    referee() {
      return this.$store.getters["referees/current"] || {};
    },
    debug: function() {
      return this.$store.getters["tournaments/debug"];
    },
    commentFieldRows: function() {
      return this.comment.split("\n").length;
    },
    notes: function() {
      if (!this.t.comments) {
        return [];
      }
      let notes = this.t.comments.items;
      return notes.sort(
        (note, previous) => new Date(note.created) - new Date(previous.created)
      );
    },
    isNew: function() {
      return !this.t.id;
    },
    isAdmin: function() {
      if (this.isNew) {
        return true;
      }
      const { id } = this.referee;
      return ((this.t.td && id == this.t.td.id) || id == this.t.createdBy );
    },
    disabled: function() {
      return (
        (!this.editable || this.locked ) || 
        (!this.isNew && !this.isReferee && !this.isAdmin)
      );
    },
    isReferee() {
      const { id } = this.referee;
      return Boolean(
        this.t.referees.find( r => r.id == id )
      );
    },
    locked: function() {
      return this.t.locked;
    }
  },
  methods: {
    loadTournamentForm(tournament) {
      this.t = new Tournament(tournament, this.$store.getters['referees/all']);
      this.countryQuery = tournament.country;
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
          { 
            tournament: this.t, 
            onSuccess: ({id}) => this.$router.push({
              name: "tournament",
              params: { id }
            }) 
          }
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
    handleDelete() {
      this.$buefy.dialog.prompt({
          message: "Are you sure you want to permanently delete this tournament? This action cannot be undone.",
          icon: "alert-circle",
          hasIcon: true,
          confirmText: "Confirm",
          inputAttrs: {
              placeholder: "Type 'delete' to confirm",
              maxlength: 6
          },
          trapFocus: true,
          type: 'is-danger',
          onConfirm: this.handleConfirmDelete
      })
    },
    handleConfirmDelete(answer) {
      if (answer !== "delete") {
        infoMessage("Type 'delete' to confirm");
      } else {
        warningMessage("Deleting...");
        this.$store.dispatch("tournaments/delete", {
          tournament: this.t,
          onSuccess: () => {
            infoMessage("Tournament deleted");
            this.$router.push({
              name: "tournaments",
              params: { year: this.t.year }
            })
          }
        });
      }
    },
    handleAddComment() {
      const comment = new Comment({
        commentTournamentId: this.t.id,
        refereeID: this.referee.id,
        message: this.comment.trim()
      });
      if (!this.t.id) {
        this.addComment(comment);
      } else {
        this.$store.dispatch('tournaments/addComment', {
          comment,
          onSuccess: this.addComment
        });
      }
    },
    addComment(comment){
      this.t.comments.items.push(comment);
      this.comment = "";
      this.showNotes = true;
      this.$refs.noteField.focus();
    },
    handleRemoveComment(comment, index) {
      const { id } = comment;
      if (!id) {
          this.t.comments.items.splice(index, 1);
      } else {
        this.$store.dispatch('tournaments/deleteComment', {
          id,
          onSuccess: () => {
            this.t.comments.items.splice(index, 1);
            warningMessage("Removed");
          }
        });
      }
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
        this.$refs.refereeField.focus();
      },
      removeReferee: function (referee) {
          let index = this.t.referees.findIndex( ref => ref.id === referee.id );
          if (index >= 0) {
              this.t.referees.splice(index, 1);
          }
      },
    addCurrent() {
      this.referee.id && this.selectReferee(this.referee);
    },
    userIsTd() {
      const { id = null } = this.referee;
      return this.t.td && id == this.t.td.id;
    },
    getEditableReferee() {
      const { id = null } = this.referee;
      return this.isAdmin //If user is the TD/creator of the tournament -> "all"
        ? "all"
        : id || "none"; //Otherwise only the current users' own stats
    },
    addReferee: function(referee) {
      this.$store.dispatch("referees/create", { 
        referee,
        onSuccess: this.selectReferee
      });
      this.ref = "";
      return true;
    },

    openAddRefereeForm() {
      this.$buefy.modal.open({
        parent : this,
        component: RefereeModal,
        props: {
          title: "New Referee",
          onSave: this.addReferee,
        },
        hasModalCard: true,
        canCancel: ['x', 'escape'],
      });
    },
    openAddTdForm() {
      this.$buefy.modal.open({
        parent : this,
        component: RefereeModal,
        props: {
          title: "New Referee as TD",
          onSave: this.addTd,
        },
        hasModalCard: true,
        canCancel: ['x', 'escape'],
      });
    },
    addTd: function(referee) {
      this.$store.dispatch("referees/create", { 
        referee,
        onSuccess: (td) => { this.t.td = td; } 
      });
      this.tdQuery = "";
      return true;
    },
    toggleLock: function() {
      infoMessage(`${this.locked ? 'Unlocking' : 'Locking'}...`);
      this.$store.dispatch("tournaments/lockTournament", {
        tournament: this.t,
        lock: !this.t.locked,
        onSuccess: ({locked}) => { this.t.locked = locked }
      });
    },
    handleFill() {
      this.t = new Tournament({
        name: "Test tournament",
        year: 2020,
        city: "Helsinki",
        country: "Finland",
        dates: ["2020-07-16","2020-07-16"],
        td: this.referee,
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
  filters: {
    date: date => new Date(date).toLocaleDateString(),
    datetime: date => {
      let dateTime = new Date(date);
      return [
        dateTime.toLocaleDateString(),
        dateTime.toLocaleTimeString([], {timeStyle: 'short'})
      ].join(" ");
    },
    refereeName: (id, refereeList) => {
      const referee = refereeList.find( r => r.id == id);
      return referee ? `${referee.firstName} ${referee.lastName}` : id;
    }
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