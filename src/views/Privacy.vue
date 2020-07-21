
<template>
  <layout>
    <template v-slot:hero-title>Privacy Policy</template>
    <p>
      ePass is part of the [IBSA] 
      (<a href="https://www.ibsasport.org/">International Blind Sports Federation</a>) 
      This privacy policy will explain how our organization uses the personal data we collect 
      from you when you use our website.
    </p>

    <h2>Topics</h2>
    <ul>
      <li>What data do we collect?</li>
      <li>How do we collect your data?</li>
      <li>How will we use your data?</li>
      <li>How do we store your data?</li>
      <li>Marketing</li>
      <li>What are your data protection rights?</li>
      <li>What are cookies?</li>
      <li>How do we use cookies?</li>
      <li>What types of cookies do we use?</li>
      <li>How to manage your cookies</li>
      <li>Privacy policies of other websites</li>
      <li>Changes to our privacy policy</li>
      <li>How to contact us</li>
      <li>How to contact the appropriate authorities</li>
    </ul>

    <h2>What data do we collect?</h2>
    
    <p>[IBSA] collects the following data</p>

    <p>
      Personal identification information (Name, email address) and 
      Non-identifiable information (Goalball Referee level, Nationality, etc.).
      [IBSA] also collects the dates and locations of the tournaments a Referee has 
      taken part in.
    </p>
    <h2>How do we collect your data?</h2>
    <p>
      You directly, or other users of ePass, provide [IBSA] with most of the data we collect. 
      We collect data and process data when you:
    </p>
    <p>
      Signup as a user or another user adds You as a TD or a Referee of one or more 
      Goalball Tournaments. [IBSA] may also receive your data indirectly from the following sources:
    </p>
    <p>
      From our own Goalball Referee registery, see 
      <a href="https://www.ibsasport.org/disclaimer-privacy-policy/">general Privacy Policy</a>.
    </p>
    
    <h2>How will we use your data?</h2>
    <p>
      [IBSA] collects your data so that we can:
    </p>
    <p>
      Uphold Goalball Referee Registry and to ensure Referees meet the requirements
      needed to uphold their Referee status.
    </p>
    
    <h2>How do we store your data?</h2>
    <p>
      [IBSA] securely stores your data at AWS datacenters in Ireland.
      Read more about <a href="https://aws.amazon.com/compliance/data-center/data-centers/">AWS DataCenters</a>.
    </p>
    <p>
      [IBSA] will keep your Personally Identifiable Data as long as you are active user.
      An active user is user who has logged into the service at least once in 12 month period. 
      Once this time period has expired, we will delete your data by anonymising it; 
      Your Personally Identifiable Data will be replaced with placeholder data, such as 
      "User 261" and &lt;email@missing&gt;.
    </p>

    <h2>Marketing</h2>
    <p>Information stored in the service is not used for marketing</p>

    <h2>What are your data protection rights?</h2>
    <p>   
      [IBSA] would like to make sure you are fully aware of all of your data 
      protection rights. Every user is entitled to the following:
    </p>
    <p>
      The right to access – You have the right to request [IBSA] for copies of 
      your personal data. We may charge you a small fee for this service.
    </p>
    <p>
      The right to rectification – You have the right to request that [IBSA] correct 
      any information you believe is inaccurate. You also have the right to request 
      [IBSA] to complete the information you believe is incomplete. As registered User
      You are able to see and edit that information from 
      <router-link :to="{ name: 'settings' }">settings</router-link>.
    </p>
    <p>
      The right to erasure – You have the right to request that [IBSA] erase your 
      personal data.
    </p>
    <p>
      The right to restrict processing – You have the right to request that [IBSA] 
      restrict the processing of your personal data, under certain conditions.
    </p>
    <p>
      The right to object to processing – You have the right to object to [IBSA]’s 
      processing of your personal data, under certain conditions.
    </p>
    <p>
      The right to data portability – You have the right to request that [IBSA] 
      transfer the data that we have collected to another organization, or directly 
      to you, under certain conditions.
    </p>
    <p>
        If you make a request, we have one month to respond to you. If you would like 
        to exercise any of these rights, please contact us at our email: [contact-email]
    </p>

    <h2>Cookies</h2>
    <p>
      Cookies are text files placed on your computer to collect standard Internet log 
      information and visitor behavior information.
    </p>
    <p>
      For further information, visit <a href="https://allaboutcookies.org">allaboutcookies.org</a>.
    </p>
    <p>
    <h2>How do we use cookies?</h2>
    <p>
      The service does not use cookies. We use other ways of authenticating users in order to 
      keep them signed in.
    </p>
    <h2>Changes to our privacy policy</h2>
    <p>
      [IBSA] keeps its privacy policy under regular review and places any updates on 
      this web page. This privacy policy was last updated on 2020-07-21.
    </p>
    <h2>How to contact us</h2>
    <p>
        If you have any questions about [IBSA]’s privacy policy, the data we hold on 
        you, or you would like to exercise one of your data protection rights, please 
        do not hesitate to contact us by email [contact-email].
    </p>
    <h2>How to contact the appropriate authority</h2>
    <p>
      Should you wish to report a complaint or if you feel that [IBSA] has not 
      addressed your concern in a satisfactory manner, you may contact the The IBSA 
      Executive Director, visit <a href="https://www.ibsasport.org/board/">here</a>
      for up-to-date contact information.
</p>
  </layout>
</template>
<script>
import Layout from "../components/Layout"
export default {
  components: {
    Layout
  }
}
</script>