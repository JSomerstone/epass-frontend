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
    <slot name="footer"></slot>
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