<template>
  <div :key="referee.id">
    <!-- PROFILE -->
    <b-collapse
      class="card"
      animation="slide"
      :open="isOpen == 'profile'"
      @open="isOpen = 'profile'"
    >
      <div
          slot="trigger"
          slot-scope="props"
          class="card-header"
          role="button">
          <span class="card-header-title">Profile</span>
          <a class="card-header-icon">
              <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'">
              </b-icon>
          </a>
      </div>
      <div class="card-content">
        <div class="content referee-form">
          <div class="field">
            <b-field label="Name" label-position="on-border">
              <b-input 
                v-model="referee.firstName"
                placeholder="Given name"
                required
                expanded
              ></b-input>
              <b-input 
                v-model="referee.lastName" 
                placeholder="Family name"
                required
                expanded
              ></b-input>
            </b-field>
          </div>
          <div class="field" v-if="false">
            <b-field label="Birth year and gender (relevant?)" label-position="on-border">
              <b-input expanded placeholder="Birth year" disabled 
              ></b-input>
              <b-select placeholder="Gender" disabled expanded>
                <option
                  v-for="option in genders"
                  :value="option.key"
                  :key="option.key"
                >
                  {{ option.gender }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="field">
            <b-field label="Nationality" label-position="on-border">
              <country-autocomplete
                v-model="referee.country"
                placeholder="As in passport"
                icon="passport"
                required
              >
              </country-autocomplete>
              <country-autocomplete
                v-model="referee.country2"
                placeholder="Second nationality"
                icon="passport"
                v-if="dualNational"
              >
              </country-autocomplete>
            </b-field>
          </div>
          <b-field>
            <b-switch v-model="dualNational">
              Second nationality
            </b-switch>
          </b-field>
          <div class="field">
            <level v-model="referee.level" label="Current level" />
          </div>
          <div class="field">
            <b-field label="Previous clinic"  />
            <b-field label="Date" label-position="on-border">
              <b-datepicker
                placeholder="Click to select..."
                icon="calendar-today"
                trap-focus
                expanded
                v-model="referee.clinic.date"
              />
              <level
                v-model="referee.clinic.level"
                hide-national
              />
            </b-field>
          </div>
          <div class="field">
            <b-field label="Cource Conductor" label-position="on-border">
              <cource-conductor v-model="referee.clinic.conductor" placeholder="Select..." expanded />
            </b-field>
          </div>
          <div class="field">
            <b-field>
              <b-button 
                type="is-primary" 
                @click="handleProfileSave" 
                icon-left="account-check"
                v-bind:loading="isLoading"
                expanded
              >Update
              </b-button>

              <button 
                class="button is-text" 
                @click="handleCancel" 
              >Cancel
              </button>
              </b-field>
          </div>
        </div>
        <pre v-if="debug">{{referee}}</pre>
      </div>
    </b-collapse><!-- /PROFILE -->

    <!-- SECURITY -->
    <b-collapse
      class="card"
      animation="slide"
      :open="isOpen == 'security'"
      @open="isOpen = 'security'"
    >
      <div
          slot="trigger"
          slot-scope="props"
          class="card-header"
          role="button">
          <span class="card-header-title">Security</span>
          <a class="card-header-icon">
              <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'">
              </b-icon>
          </a>
      </div>
      <div class="card-content">
          <div class="field">
            <b-field label="Email">
              <b-input type="email" v-model="newEmail" required/>
            </b-field>
          </div>
          <b-field label="Change password"></b-field>
          <div class="field">
            <b-field label="Current" label-position="on-border">
              <b-input type="password" v-model="currentPassword" required/>
            </b-field>
          </div>
          <div class="field">
            <b-field label="New" label-position="on-border">
              <b-input type="password" v-model="newPassword" required/>
            </b-field>
          </div>
          <div class="field">
            <b-field>
              <password v-model="newPassword" strength-meter-only />
            </b-field>
          </div>
          <div class="field">
            <b-field label="Confirm new" label-position="on-border">
              <b-input type="password" v-model="confirmPassword" required/>
            </b-field>
          </div>
        <div class="field">
          <b-field>
            <b-button 
              @click="handleSecuritySave" 
              type="is-primary" 
              icon-left="account-check"
              expanded
            >Update
            </b-button>
            <b-button type="is-text" @click="resetSecurityForm">Cancel</b-button>
          </b-field>
        </div>
      </div>
    </b-collapse><!-- /SERCURITY -->
    <!-- ASSOCIATION -->
    <b-collapse
      class="card"
      animation="slide"
      :open="isOpen == 'association'"
      @open="isOpen = 'association'"
    >
      <div
          slot="trigger"
          slot-scope="props"
          class="card-header"
          role="button">
          <span class="card-header-title">National Association</span>
          <a class="card-header-icon">
              <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'">
              </b-icon>
          </a>
      </div>
      <div class="card-content">
        <div class="field">
          <b-field label="Country">
            <country-autocomplete
              v-model="association.country"
              placeholder="Country"
              icon="earth"
              required
              expanded
              :onSelect="selectAssociation"
            >
            </country-autocomplete>
          </b-field>
        </div>
        <div class="field"><b-field label="Name" ><b-input v-model="association.name" /></b-field></div>
        <div class="field"><b-field label="Address" ><b-input v-model="association.address" /></b-field></div>
        <div class="field"><b-field label="Email" ><b-input v-model="association.email" /></b-field></div>
        <div class="field">
          <b-field label="Referee Coordinator" >
            <b-field>
              <b-input placeholder="Name" v-model="association.coordinator"  expanded/>
              <b-input placeholder="Email" v-model="association.coordinatorEmail" expanded/>
            </b-field>
          </b-field>
        </div>
        <div class="field">
          <b-field>
            <b-button type="is-primary" @click="handleAssociationSave" expanded>
              Save
            </b-button>
            <b-button type="is-text" @click="loadData">Cancel</b-button>
          </b-field>
        </div>
      </div>
        <pre v-if="debug">{{association}}</pre>
    </b-collapse><!-- /ASSOCIATION -->
  </div>
</template>
<style lang="css">
.referee-form {
  padding: 20px;
}
</style>
<script>
import Referee from "../store/models/RefereeClass";
import Association from "../store/models/Association";
import { infoMessage, warningMessage, successMessage } from '../utils/notificationUtils';
import CourceConductor from "./CourceConductor";
import Level from "./field/Level"
import CountryAutocomplete from "./field/CountryAutocomplete";
import Password from 'vue-password-strength-meter';
export default {
  components: {
    CourceConductor,
    Level,
    CountryAutocomplete,
    Password,
  },
  data() {
    return {
      isOpen: this.$route.params.category || 'profile',
      referee: new Referee(),
      association: new Association(),
      newEmail: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      dualNational: false,
      associationCountry: "",
      genders: [
        { key: "m", gender: "Male" },
        { key: "f", gender: "Female" },
        { key: "x", gender: "Other" },
      ]
    }
  },
  computed: {
    userId: function() {
      return this.$store.getters["auth/user"].userId || null
    },
    isLoading: function() {
      return this.$store.getters["auth/loading"] || this.$store.getters["referees/loading"]
    },
    original: function() {
      return this.$store.getters['referees/current'];
    },
    debug: function() {
      return this.$store.getters['referees/debug'];
    }
  },
  methods: {
    handleProfileSave: function() {
      if (this.referee.id) {
        this.$store.dispatch("referees/update", { referee: this.referee });
      } else {
        this.$store.dispatch("referees/create", { referee: this.referee });
      }
    },
    handleCancel: function() {
      this.loadData(true);
    },
    handleSecuritySave: function() {
      if (this.referee.email !== this.newEmail) {
        this.handleEmailUpdate();
      }
      if (this.newPassword != "") {
        this.handlePasswordUpdate();
      }
    },
    handleEmailUpdate: function() {
      infoMessage("Updating email...");
      this.$store.dispatch("auth/changeEmail", {
        email: this.newEmail,
        onSuccess: this.openConfirmDialog,
      })
    },
    openConfirmDialog() {
      this.$buefy.dialog.prompt({
        message: `A verification code has been sent to <i>&lt;${ this.newEmail }&gt;</i>, please enter it here:`,
        inputAttrs: {
            placeholder: 'Verification code',
            maxlength: 6
        },
        trapFocus: true,
        onConfirm: this.handleConfirmEmailUpdate
      });
    },

    handleConfirmEmailUpdate: function(verificationCode) {
      this.$store.dispatch("auth/verifyEmailChange", {
        verificationCode,
        onSuccess: this.emailUpdated,
      })
    },

    emailUpdated() {
      this.referee.email = this.newEmail;
      this.handleProfileSave();
    },

    handlePasswordUpdate() {
      if (this.newPassword !== this.confirmPassword) {
        warningMessage("Passwords do not match");
      } else{
        this.$store.dispatch("auth/changePassword", {
          oldPassword: this.currentPassword,
          newPassword: this.newPassword,
          onSuccess: this.resetSecurityForm,
        });
      }
    },
    selectAssociation: function(country) {
      if(!country) {
        return;
      }
      let matches = this.$store.getters['referees/associationCountry'](country);
      if (matches.length) {
        this.association = new Association(matches[0]);
      } else {
        this.association = new Association({ country });
      }
    },
    handleAssociationSave() {
      let action = this.association.id 
        ? "referees/updateAssociation"
        : "referees/createAssociation";

      this.$store.dispatch(action, {
        association: this.association,
        onSuccess: (updated) => {
          if (this.referee.associationId != updated.id) {
            this.referee.associationId = updated.id;
            infoMessage("Updating profile...");
            this.handleProfileSave();
          } else {
            successMessage("Updated");
          }
        }
      });
    },
    loadData: function( force = false ) {
      if (this.referee.id && !force) {
        return; //Prevent double-loading
      } else if (this.isLoading) {
        setTimeout( this.loadData, 500 );
        return;
      }
      this.referee = new Referee(this.$store.getters["referees/current"]);
      if (this.referee.associationId) {
        this.association = this.$store.getters['referees/association'](this.referee.associationId);
      } else if (this.referee.country) {
        let matches = this.$store.getters['referees/associationCountry'](this.referee.country);
        this.association = matches.length ? matches[0] : new Association({
          country: this.referee.country
        });
        this.referee.associationId = this.association.id;
      }
      this.newEmail = this.referee.email;
      this.dualNational = Boolean(this.referee.country2);
    },
    resetSecurityForm: function() {
      this.newEmail = "";
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    }
  },
  watch: {
    original: function() {
      console.log("State changed, updating form");
      this.loadData();
    },
    isOpen: function(category){
      this.$router.replace({
        name: 'settings',
        params: { category }
      });
    },
    dualNational: function(value) {
      if (!value) {
        this.referee.country2 = null;
      }
    }
  },
  created() {
    this.loadData();
  }
}
</script>