<template>
  <div >
    <b-field label="Email" label-position="on-border">
      <b-input 
        type="email" 
        v-model="email" 
        placeholder="@" 
        required 
        :disabled="verificationCodeSent"
      ></b-input>
    </b-field>
    
    <b-field label="Verification code" label-position="on-border" >
      <b-input 
        v-model="code" 
        required 
        :disabled="!verificationCodeSent"
        maxlength="6"
      ></b-input>
    </b-field>

    <b-field label="New password" label-position="on-border">
      <b-input 
        type="password" 
        v-model="password" 
        placeholder="********" 
        required
        :disabled="!verificationCodeSent"
      ></b-input>
    </b-field>

    <b-field>
      <b-button 
        @click="handleForgotPassword" 
        expanded 
        icon-left="account-question"
        v-bind:type="sendButtonType"
        v-bind:disabled="verificationCodeSent || !email"
      >Send verification code
      </b-button>

      <b-button 
        @click="handleForgotPasswordConfirm" 
        v-bind:type="saveButtonType"
        icon-left="account-check"
        v-bind:disabled="!verificationCodeSent"
        expanded
      >Save new password
      </b-button>
    </b-field>
  </div>
</template>
<script>
import { successMessage, infoMessage } from '../utils/notificationUtils';
export default {
  data() {
    return {
      email: "",
      password: "",
      code: "",
      verificationCodeSent: false,
    }
  },
  computed: {
    sendButtonType: function() {
      return this.verificationCodeSent
        ? 'is-light'
        : 'is-primary';
    },
    saveButtonType: function() {
      return this.verificationCodeSent
        ? 'is-primary'
        : 'is-light';
    }
  },
  methods: {
    handleForgotPassword() {
      this.$store.dispatch("auth/forgotPassword", {
        email: this.email,
        onSuccess: () => {
          infoMessage(`Verification code sent, `)
          this.verificationCodeSent = true
        }
      });
    },

    handleForgotPasswordConfirm(){
      this.$store.dispatch("auth/forgotPasswordConfirm", {
        email: this.email,
        code: this.code,
        newPassword: this.password,
        onSuccess: () => {
          successMessage("Password reset, plase log in");
          this.$router.push({ name: 'login' });
         }
      });
    }
  },
}
</script>