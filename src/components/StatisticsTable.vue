<template>
  <div class="statistics">
    <h2>International</h2>
    <p>
      <strong>{{ statistics.tournaments.international }}</strong> 
      / x tournaments
    </p>
    <p>
      <strong>{{ statistics.games.international }}</strong> 
      / x games as referee
    </p>
    <p>
      <strong>{{ statistics.tenSeconds.international }}</strong> 
      games as 10s timer / table official
    </p>
    <h2>National</h2>
    <p>
      <strong>{{ statistics.tournaments.national }}</strong> 
      / x tournaments
    </p>
    <p>
      <strong>{{ statistics.games.national }}</strong> 
      / x games as referee
    </p>
    <p>
      <strong>{{ statistics.tenSeconds.national }}</strong> 
      games as 10s timer / table official
    </p>
    <pre>{{ statistics }}</pre>
  </div>
</template>
<script>
export default {
  props: ["year", "tournaments", "referee"],
  
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
          stats.tenSeconds[type] += tenSeconds;
          stats.tournaments[type] += 1;
          return stats;
        },
        {
          games: { international: 0, national: 0 },
          tenSeconds: { international: 0, national: 0 },
          tournaments: { international: 0, national: 0 },
        }
      );
    },
  }
}
</script>