<template>
  <div>
    <section class="header">
      <navbar></navbar>
    </section>
    <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          ePass
        </h1>
        <h2 class="subtitle">
          for goalball referees
        </h2>
      </div>
    </div>
  </section>
  <section class="content">
    <div class="container">
      <h1><slot name="title">Title</slot></h1>
      <slot></slot>
    </div>
  </section>
  <section class="footer">
    <slot name="footer">Title</slot>
  </section>
  </div>
</template>
<script>
import Navbar from "./Navbar"
export default {
  components: {
    Navbar
  }
}
</script>