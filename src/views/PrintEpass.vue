<template>
  <div class="container">

    <section class="hero">
      <h1 class="title">Goalball Official's e-passport {{ year }}</h1>
    </section>

    <section class="content" v-if="!loading">
      <h2>Official's data</h2>
      <table class="bordered">
        <tr><td>Family name</td><td>{{ referee.lastName }}</td></tr>
        <tr><td>Given name</td><td>{{ referee.firstName }}</td></tr>
        <tr>
          <td>Nationality</td>
          <td>{{ referee.country }}{{ referee.country2 ? `, ${referee.country2}` : '' }}</td>
        </tr>
        <tr><td>Email</td><td>{{ referee.email }}</td></tr>
        <tr><td>Level at January</td><td>{{ referee.level }}</td></tr>
        <tr><td>Level at December</td><td>{{ referee.level }}</td></tr>
        <tr>
          <td>Last clinic</td>
          <td v-if="referee.clinic.date">
            {{ referee.clinic.date | yyyymmdd }}, Level: {{ referee.clinic.level }} by {{ referee.clinic.conductor }}
          </td>
          <td v-else>-</td>
        </tr>
      </table>
      <h2>National association data</h2>
      <table class="bordered" v-if="association">
        <tr><td>Name</td><td>{{ association.name }}</td></tr>
        <tr><td>Address</td><td>{{ association.address || "-" }}</td></tr>
        <tr><td>Country</td><td>{{ association.country }}</td></tr>
        <tr><td>Email</td><td>{{ association.email }}</td></tr>
        <tr>
          <td>Referee coordinator</td>
          <td>
            {{ association.coordinator }} 
            &lt;{{ association.coordinatorEmail }}&gt;
          </td>
        </tr>
      </table>
      <div v-else>- missing -</div>

      <h2>Tournament information</h2>
      <table class="bordered" v-for="(item, index) in tournaments" :key="item.id">
        <thead>
          <td><strong>Tournament {{ index+1 }}</strong></td>
          <td>{{ item.international ? "International" : "National" }}</td>
        </thead>
        <tr><td>Date of tournament</td><td>{{ item.dates | dateRange }}</td></tr>
        <tr><td>Name of tournament</td><td>{{ item.name }}</td></tr>
        <tr><td>Place of tournament</td><td>{{ item.city }}, {{ item.country }}</td></tr>
        <tr>
          <td>Tournament Director / TD</td>
          <td>{{ getRefereeNameAndEmail(item.td) }}</td>
        </tr>
        <tr>
          <td>Number of games as referee</td>
          <td>{{ item.referees | statistics(referee.id) | games }}</td>
        </tr>
        <tr>
          <td>Number of games as table official / 10 sec timer</td>
          <td>{{ item.referees | statistics(referee.id) | tenSeconds }}</td>
        </tr>
        <tr>
          <td>Names of other referees</td>
          <td>{{ getRefereeNames(item.referees, referee.id) }}</td>
        </tr>
        <tr>
          <td>Teams competing</td>
          <td>{{ item.teams.join(', ') }}</td>
        </tr>
      </table>
      <div class="updated-info">
        <i>Updated {{ new Date() | yyyymmdd }}</i>
      </div>
    </section>
    <section class="footer no-print">
      <b-button 
        type="is-info" 
        outlined 
        icon-left="printer"
        @click="initPrint"
      >Print
      </b-button>

      <b-button 
        type="is-info"
        outlined 
        icon-left="clipboard-text-outline"
        @click="copyLink"
      >Copy link to this page
      </b-button>
      <input id="direct-link" class="hidden" :value="linkToPage" />
    </section>
  </div>
</template>
<style lang="css" scoped>
.container {
  padding-top: 2em;
  padding-bottom: 4em;
}
h1 {
  text-transform: uppercase;
}
.hero>h1, .content>h2, .content>h3 {
  margin-bottom: 1em;
}
.content table.bordered, .updated-info {
  margin-bottom: 2em !important;
}
.bordered {
  border: 2px solid black;
}
.content table td:not(:last-of-type) {
  width: 30%
}
@media print {
   .no-print {
      visibility: hidden;
   }
}
</style>
<script>
const ymd = v => new Date(v).toISOString().split("T")[0];
import Referee from "../store/models/RefereeClass";
import { successMessage, warningMessage } from '../utils/notificationUtils';

export default {
  components: {
  },
  data() {
    return {
      year: this.$route.params.year || new Date().getFullYear(),
      refereeId: this.$route.params.refereeId
    }
  },
  computed: {
    loading: function() {
      return this.$store.getters["referees/loading"] || this.$store.getters["tournaments/loading"];
    },
    tournaments() {
      return this.$store.getters["tournaments/refereesTournaments"] || [];
    },
    referee() {
      return this.$store.getters["referees/selected"] || new Referee();
    },
    association() {
      const { associationId } = this.referee;
      return this.$store.getters["referees/nationalAssociations"].find(
        a => a.id == associationId
      ) || null;
    },
    linkToPage() {
      const domain = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
      const path = this.$router.resolve({ 
        name: 'print-epass', 
        params: { refereeId: this.referee.id, year: this.year }
      })
      return `${domain}${path.href}`;
    }
  },
  methods: {
    loadData: function() {
      this.$store.dispatch("tournaments/loadRefereesTournaments", { refereeId: this.refereeId, year: this.year });
      this.$store.dispatch("referees/load", { force: true });
      this.$store.dispatch("referees/loadSelected", { id: this.refereeId, force: true });
      this.$store.dispatch("referees/loadAssociations", { force: true });
    },
    initPrint() {
      window.print();
    },
    copyLink() {
      var copyText = document.querySelector("#direct-link");
      copyText.select();
      try{
        document.execCommand("copy");
        successMessage("Copied");
      } catch (e) {
        warningMessage("Could not copy");
      }
    },
    getReferee(id){
      return this.$store.getters['referees/byId'](id) || null;
    },
    getRefereeNameAndEmail(id) {
      const ref = this.getReferee(id)
      return ref
        ? `${ref.firstName} ${ref.lastName} <${ref.email}>`
        : id
    },
    getRefereeNames(referees, skipId) {
      return referees
        .filter(({ id }) => id !== skipId)
        .map(
          ({ id }) => this.getReferee(id)
        )
        .map( ref => `${ref.firstName} ${ref.lastName}`)
        .join(', ');
    }
  },
  filters: {
    yyyymmdd: date => ymd(date),
    dateRange: function(dates){
      if (dates[0] == dates[1]) {
        return ymd(dates[0])
      } else {
        return [
          ymd(dates[0]),
          ymd(dates[1])
        ].join(' - ');
      }
    },
    statistics: function(referees, id) {
      return referees.find(
        r => r.id == id
      ) || { games: '-', tenSeconds: '-'};
    },
    games: stats => stats.games,
    tenSeconds: stats => stats.tenSeconds,
  },
  created() {
    this.loadData();
  }

}
</script>