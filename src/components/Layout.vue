<template>
  <div>
    <section class="header">
      <navbar></navbar>
    </section>
    <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          <slot name="hero-title"></slot>
        </h1>
        <h2 class="subtitle">
          <slot name="hero-subtitle"></slot>
        </h2>
      </div>
    </div>
  </section>
  <section class="content">
    <b-loading :active.sync="isLoading" >
    </b-loading>
    <div class="container">
      <h1><slot name="title"></slot></h1>
      <slot></slot>
    </div>
  </section>
  <section class="footer">
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <router-link :to="{ name: 'about'}">About</router-link>
          | 
          <router-link :to="{ name: 'privacy'}">Privacy Policy</router-link>
        </p>
        <p>
          <strong>ePass</strong> by <a href="https://jsomerstone.github.io/">Joona Somerkivi</a>. 
          The source code is licensed under <a href="http://www.apache.org/licenses/">Apache Lisence v. 2</a>.
        </p>
      </div>
    </footer>
  </section>
  </div>
</template>
<script>
import Navbar from "./Navbar"
export default {
  components: {
    Navbar
  },
  computed: {
    isLoading: function() {
      return this.$store.getters['tournaments/loading'] 
        || this.$store.getters['referees/loading']
        || this.$store.getters['auth/loading'];
    }
  },
}
</script>