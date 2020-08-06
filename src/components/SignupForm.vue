<template>
  <div class="columns">
    <div class="column"></div>
    <div class="column is-half">
      <b-steps v-model="step" animated :has-navigation="false" class="signup-steps">
        <b-step-item label="Authentication" step="1" :clickable="false">
          <b-field label="Email" label-position="on-border">
            <b-input type="email" v-model="referee.email" placeholder="@" required></b-input>
          </b-field>
          <b-field label="Choose a password" label-position="on-border">
            <b-input type="password" v-model="password" placeholder="********" required></b-input>
          </b-field>
          <b-field>
          <b-button 
            @click="handleSignup" 
            v-bind:type="signupButton" 
            expanded 
            icon-left="clipboard-check"
            v-bind:loading="isLoading"
            v-bind:disabled="!authFormReady"
          >Signup
          </b-button>
        </b-field>
        </b-step-item> <!--/Authentication -->

        <b-step-item label="Verification" step="2"  :clickable="false">
          <p>
            A verification code has been sent to <i>&lt;{{ signupEmail }}&gt;</i>, 
            please enter it here:
          </p>
          <b-field label="Verification code">
            <b-input 
              custom-class="center-text" 
              v-model="verification" 
              maxlength="6" 
              :has-counter="false" 
              size="is-large"
            ></b-input>
          </b-field>
          <b-field>
            <b-button 
              v-bind:type="verifyButton" 
              @click="handleVerification"
              v-bind:loading="isLoading"
              icon-left="account-check"
              expanded
              :disabled="verification.length != 6"
            >Verify
            </b-button>
            <b-button 
              @click="handleResend" 
              v-bind:loading="isLoading"
              type="is-text"
            >Resend</b-button>
          </b-field>
        </b-step-item> <!--/Verification -->
        <b-step-item label="Profile" step="3"  :clickable="false">
          <b-field label="Name" label-position="on-border">
            <b-input v-model="referee.firstName" required expanded placeholder="Given name" />
            <b-input v-model="referee.lastName" required expanded placeholder="Family name" />
          </b-field>
          <b-field label="Nationality" label-position="on-border">
            <b-autocomplete
                v-model="countryQuery"
                placeholder="As in passport"
                icon="passport"
                keep-first
                required
                :data="getCountries(countryQuery)"
                @select="option => this.referee.country = option"
            >
            </b-autocomplete>
          </b-field>
          <level v-model="referee.level" />
          <b-field>
            <b-button
              @click="findExistingProfile"
              icon-left="account-search-outline"
              v-if="debug"
            >
            </b-button>
            <b-button 
              v-bind:type="profileButton" 
              @click="handleSaveProfile"
              v-bind:loading="isLoading"
              icon-left="card-account-details"
              expanded
              v-bind:disabled="!profileReady"
            >Save
            </b-button>
          </b-field>
          <pre v-if="debug">{{ referee }}</pre>
        </b-step-item> <!--/Profile -->
        <b-step-item label="Done" step="4" :clickable="false">
          <h2>Welcome {{referee.firstName}}</h2>
          <p>
            Your account is now set up and you can start filling your ePass from 
            <router-link 
              :to="{ path: '/' }"
              class="button is-link"
            >here</router-link>
          </p>
        </b-step-item> <!--/Profile -->
      </b-steps>
    </div>
    <div class="column"></div>
  </div>
</template>
<style>
input.center-text {
  text-align: center;
}
.signup-steps li {
  list-style: none;
}
</style>
<script>
import Referee from "../store/models/RefereeClass";
import Level from "./field/Level";
import { infoMessage } from '../utils/notificationUtils';
import { mapGetters } from 'vuex';
  export default {
    components: {
      Level,
    },
    data() {
      return {
        signupButton: "is-primary",
        verifyButton: "is-primary",
        profileButton: "is-primary",
        loginButton: "is-primary",
        referee: new Referee(),
        password: "",
        verification: "",
        countryQuery: "",
      }
    },
    methods: {
      handleSignup: function() {
        this.$store.dispatch('auth/signUp', { 
          email: this.referee.email,
          password: this.password,
          onSuccess: this.nextStep,
          onFailure: (error) => {
            (error.code == "UsernameExistsException") && this.nextStep();
          }
        });
      },

      handleVerification: function() {
        this.$store.dispatch('auth/verifyAddress', { 
          email: this.referee.email,
          code: this.verification,
          onSuccess: this.handleLogin
        });
      },

      handleLogin: function() {
        this.$store.dispatch('auth/login', { 
          email: this.referee.email,
          password: this.password,
          onSuccess: () => {
            this.findExistingProfile();
            this.nextStep();
          }
        });
      },

      handleSaveProfile() {
        const action = this.referee.id ? 'update' : 'create';
        this.$store.dispatch(`referees/${action}`, { 
          referee: this.referee,
          onSuccess: this.nextStep
        });
      },

      findExistingProfile() {
        this.$store.dispatch('referees/findByEmail', { 
          email: this.referee.email,
          onSuccess: this.preFillProfile
        });
      },

      preFillProfile(results = []) {
        if (!results || results.length < 1) {
          return;
        } else {
          infoMessage("Profile found");
          this.referee = new Referee(results[0]);
          this.referee.userId = this.userId;
          this.countryQuery = this.referee.country;
        }
      },

      nextStep() {
        this.$store.dispatch('auth/setSignupStep', { step: this.step + 1 });
      },
      
      handleResend: function() {
        this.$store.dispatch('auth/resendVerification');
      },

      getCountries: function(name) {
        return name
          ? this.$store.getters['countries/byName'](name)
          : [];
      }
    },
    computed: {
      authFormReady: function() {
        return (
          this.referee.email && this.password.length >= 8
        )
      },
      profileReady: function() {
        return this.referee.isValid();
      },
      userId: function() {
        return this.$store.getters["auth/user"].userId || null;
      },
      ...mapGetters({
        debug: 'auth/debug',
        step: "auth/signupStep",
        signupEmail: "auth/signupEmail",
        isLoading: "auth/loading",
        loggedIn: "auth/loggedIn",
      })
    },
    watch: {
      signupEmail: function(email) {
        this.referee.email = email;
      },
      userId: function(userId) {
        this.referee.userId = userId;
      }
    }
  }
</script>