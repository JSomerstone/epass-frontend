<template>
  <div class="columns">
    <div class="column"></div>
    <div class="column is-half">
      <b-steps v-model="step" animated :has-navigation="false">
        <b-step-item label="Authentication" step="1">
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

        <b-step-item label="Verification" step="2">
          <p>
            You will receive a verification code to address <i>&lt;{{ referee.email }}&gt;</i> soon, 
            please write it here:
          </p>
          <b-field label="Verification code">
            <b-input v-model="verification" maxlength="6" :has-counter="false" size="is-large"></b-input>
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
          </b-field>
        </b-step-item> <!--/Verification -->
        <b-step-item label="Profile" step="3">
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
          <b-field>
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
        </b-step-item> <!--/Profile -->
        <b-step-item label="Done" step="4">
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

<script>
import Referee from "../store/models/RefereeClass"
  export default {
    data() {
      return {
        signupButton: "is-primary",
        verifyButton: "is-primary",
        profileButton: "is-primary",
        referee: new Referee({ id: null }),
        password: "",
        verification: "",
        countryQuery: "",
      }
    },
    methods: {
      handleSignup: function() {
        this.$store.dispatch('auth/signUp', { 
          username: this.referee.email,
          password: this.password
        });
      },

      handleVerification: function() {
        this.$store.dispatch('auth/setLoading', { loading: true });
        setTimeout(() => {  
          this.$store.dispatch('auth/setLoading', { loading: false });
          this.verifyButton = "is-success"; 
        }, 1000);
        setTimeout(() => { this.activeStep += 1; }, 2000);
      },

      handleSaveProfile: function() {
        this.$store.dispatch('auth/setLoading', { loading: true });
        setTimeout(() => {  
          this.$store.dispatch('auth/setLoading', { loading: false });
          this.profileButton = "is-success"; 
        }, 1000);
        setTimeout(() => { this.activeStep += 1; }, 2000);
      },

      getCountries: function(name) {
        return name
          ? this.$store.getters['countries/byName'](name)
          : [];
      }
    },
    computed: {
      step: function() {
        return this.$store.getters['auth/signupStep']
      },
      isLoading: function() {
        return this.$store.getters['auth/loading']
      },
      authFormReady: function() {
        return (
          this.referee.email && this.password.length >= 8
        )
      },
      profileReady: function() {
        return this.referee.isValid();
      }
    }
  }
</script>