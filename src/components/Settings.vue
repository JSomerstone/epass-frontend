<template>
  <div>
    <!-- PROFILE -->
    <b-collapse
      class="card"
      animation="slide"
      :open="isOpen == P"
      @open="isOpen = P"
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
            <b-field label="Given name" label-position="on-border">
              <b-input 
                v-model="referee.firstName" 
                required
                expanded
              ></b-input>
            </b-field>
            <b-field label="Family name" label-position="on-border">
              <b-input 
                v-model="referee.lastName" 
                required
                expanded
              ></b-input>
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
            <b-field label="Level" label-position="on-border">
              <b-radio-button v-model="referee.level" :native-value="1" >
                  1
              </b-radio-button>
              <b-radio-button v-model="referee.level" :native-value="2" >
                  2
              </b-radio-button>
              <b-radio-button v-model="referee.level" :native-value="3" >
                  3
              </b-radio-button>
              <b-radio-button v-model="referee.level" :native-value="0" >
                  National
              </b-radio-button>
            </b-field>
          </div>
          <div class="field">
            <b-button 
              type="is-primary" 
              @click="handleProfileSave" 
              icon-left="account-check"
              v-bind:loading="isLoading"
            >
              Save</b-button>
            <button class="button is-text" @click="handleCancel">Cancel</button>
          </div>
        </div>
      </div>
    </b-collapse><!-- /PROFILE -->

    <!-- SECURITY -->
    <b-collapse
      class="card"
      animation="slide"
      :open="isOpen == S"
      @open="isOpen = S"
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
      :open="isOpen == N"
      @open="isOpen = N"
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
        Placeholder for national association of {{ referee.country }} settings.
        Or whatever country the referee lives in...
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
import { infoMessage, warningMessage, successMessage } from '../utils/notificationUtils';
export default {
  data: () => {
    return {
      S: 'security',
      P: 'profile',
      N: 'national-association',
      isOpen: 'profile',
      referee: new Referee(),
      newEmail: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      countryQuery: "",
    }
  },
  computed: {
    userId: function() {
      return this.$store.getters["auth/user"].userId || null
    },
    isLoading: function() {
      return this.$store.getters["auth/loading"] || this.$store.getters["referees/loading"]
    },
    referees: function() {
      return this.$store.getters['referees/all'];
    },
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

    emailUpdated(result) {
      console.log("emailUpdated:result", result);
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
      this.referee = new Referee(
        this.$store.getters["referees/byUserId"](this.userId) || {}
      );
      this.countryQuery = this.referee.country;
      this.newEmail = this.referee.email;
    }
  },
  watch: {
    userId: function() {
      this.loadData();
    }
  },
  created() {
    this.loadData();
  }
}
</script>