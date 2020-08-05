<template>
  <div class="statistics">
    <div v-if="referee.level > 0">
      <h2>Certification maintanance, level {{ referee.level }}</h2>
      <p>
        <b-icon
          :icon="iconInternationalGames()"
          :type="iconType(minInternationalGames, statistics.games.international)">
        </b-icon>
        <span class="large"><strong>{{ statistics.games.international }}</strong> 
        / {{ minInternationalGames }}</span> international games as a referee
      </p>
      <p>
        <b-icon
          :icon="iconTotalGames()"
          :type="iconType(minTotalGames, statistics.games.total)">
        </b-icon>
        <span class="large"><strong>{{ statistics.games.total }}</strong> 
        / {{ minTotalGames }}</span> total games as a referee
      </p>
    </div>
    <table>
        <tr>
          <th></th>
          <th>Tournaments</th>
          <th>Games</th>
          <th>10s / table official</th>
        </tr>
        <tr>
          <td>International</td>
          <td>{{ statistics.tournaments.international }}</td>
          <td>{{ statistics.games.international }}</td>
          <td>{{ statistics.tenSeconds.international }}</td>
        </tr>
        <tr>
          <td>National</td>
          <td>{{ statistics.tournaments.national }}</td>
          <td>{{ statistics.games.national }}</td>
          <td>{{ statistics.tenSeconds.national }}</td>
        </tr>

        <tr>
          <td>Total</td>
          <td>{{ statistics.tournaments.total }}</td>
          <td>{{ statistics.games.total }}</td>
          <td>{{ statistics.tenSeconds.total }}</td>
        </tr>
    </table>
  </div>
</template>
<style>
span.large {
  font-size: xx-large;
}
</style>
<script>
export default {
  props: ["year", "tournaments", "referee"],
  data() {
    return {
      requirements: {
        lvl1: {
          total: 8,
          international: 0
        },
        lvl2: {
          total: 12,
          international: 4
        },
        lvl3: {
          total: 18,
          international: 10
        },
      }
    }
  },
  computed: {
    statistics: function() {
      const { id } = this.referee;
      
      return this.tournaments.map(
        t => {
          return {
            international: t.international,
            ...t.referees.find( r => r.id == id )
          }
        }
      ).reduce(
        (stats, { international, games, tenSeconds }) => {
          let type = international 
            ? 'international' 
            : 'national';
          stats.games[type] += games;
          stats.games.total += games;
          stats.tenSeconds[type] += tenSeconds;
          stats.tenSeconds.total += tenSeconds;
          stats.tournaments[type]++;
          stats.tournaments.total++;
          return stats;
        },
        {
          games: { international: 0, national: 0, total: 0 },
          tenSeconds: { international: 0, national: 0, total: 0 },
          tournaments: { international: 0, national: 0, total: 0 },
        }
      );
    },
    minInternationalGames: function() {
      return (this.referee.level) 
        ? this.requirements[`lvl${this.referee.level}`].international
        : 0
    },
    minTotalGames: function() {
      return (this.referee.level) 
        ? this.requirements[`lvl${this.referee.level}`].total
        : 0
    }
  },
  methods: {
    iconInternationalGames: function() {
      return (this.statistics.games.international >= this.minInternationalGames)
        ? 'check-circle'
        : 'alert-circle-outline'
    },
    iconTotalGames: function() {
      return (this.statistics.games.total >= this.minTotalGames)
        ? 'check-circle'
        : 'alert-circle-outline'
    },
    iconType: function(expected, actual) {
      return (expected <= actual)
        ? 'is-success'
        : 'is-warning'
    }
  },
}
</script>