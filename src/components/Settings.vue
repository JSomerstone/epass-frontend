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
          <div class="field">
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
              <b-autocomplete
                v-model="countryQuery"
                placeholder="As in passport"
                icon="passport"
                :keep-first="true"
                required
                expanded
                :data="getCountries(countryQuery)"
                @select="option => referee.country = option"
              >
              </b-autocomplete>
            </b-field>
          </div>
          <div class="field">
            <b-field label="Referee Level" label-position="on-border">
              <b-radio-button v-model="referee.level" :native-value="0" >
                  National
              </b-radio-button>
              <b-radio-button v-model="referee.level" :native-value="1" >
                  1
              </b-radio-button>
              <b-radio-button v-model="referee.level" :native-value="2" >
                  2
              </b-radio-button>
              <b-radio-button v-model="referee.level" :native-value="3" >
                  3
              </b-radio-button>
            </b-field>
          </div>
          <div class="field">
            <b-field label="Previous clinic date" label-position="on-border">
              <b-datepicker
                placeholder="Click to select..."
                icon="calendar-today"
                trap-focus
                v-model="referee.clinic.date"
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
              >Save
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
        <form>
          <div class="field">
            <b-field label="Email">
              <b-input type="email" v-model="newEmail" required/>
            </b-field>
          </div>
        </form>
        <form>
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
            <b-field label="Confirm new" label-position="on-border">
              <b-input type="password" v-model="confirmPassword" required/>
            </b-field>
          </div>
        </form>
        <div class="field">
          <b-button 
            @click="handleSecuritySave" 
            type="is-primary" 
            icon-left="account-check"
          >Update
          </b-button>
        </div>
        <hr />
        <div>
          Placeholder for 2FA settings
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
        <p>Placeholder form - not functional</p>
        <div class="field"><b-field label="Name" ><b-input /></b-field></div>
        <div class="field">
          <b-field label="Country">
            <b-autocomplete
              v-model="countryQuery"
              placeholder="Country"
              icon="earth"
              :keep-first="true"
              required
              expanded
              :data="getCountries(countryQuery)"
              @select="option => countryQuery = option"
            >
            </b-autocomplete>
          </b-field>
        </div>
        <div class="field"><b-field label="Address" ><b-input /></b-field></div>
        <div class="field"><b-field label="Email" ><b-input /></b-field></div>
        <div class="field">
          <b-field label="Referee Coordinator" >
            <b-field>
              <b-input placeholder="Name" />
              <b-input placeholder="Email"/>
            </b-field>
          </b-field>
        </div>
        <div class="field">
          <b-field>
            <b-button type="is-primary" @click="infoMessage('Unimplemented')" expanded>Save</b-button>
            <b-button type="is-text" @click="infoMessage('Unimplemented')">Cancel</b-button>
          </b-field>
        </div>
      </div>
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
import { infoMessage, warningMessage } from '../utils/notificationUtils';
import CourceConductor from "./CourceConductor";
export default {
  components: {
    CourceConductor
  },
  data() {
    return {
      isOpen: this.$route.params.category || 'profile',
      referee: new Referee(),
      newEmail: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      countryQuery: "",
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
      this.loadData();
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
          newPassword: this.newPassword
        });
      }
    },
    getCountries: function(name) {
      return name
        ? this.$store.getters['countries/byName'](name)
        : [];
    },
    loadData: function() {
      this.referee = new Referee(this.$store.getters["referees/current"]);
      console.log('Loaded data', this.referee)
      this.countryQuery = this.referee.country;
      this.newEmail = this.referee.email;
    }
  },
  watch: {
    original: function() {
      this.loadData();
    },
    isOpen: function(category){
      this.$router.replace({
        name: 'settings',
        params: { category }
      });
    }
  },
  created() {
    this.loadData();
  }
}
</script>