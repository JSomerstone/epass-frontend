<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
    </header>
    <section class="modal-card-body">
        <referee-form
          v-model="referee"
        />
    </section>
    <footer class="modal-card-foot">
        <b-button 
          type="is-info" 
          icon-left="account-plus" 
          expanded
          :disabled="!referee.isValid()"
          @click="handleSave"
        >Save</b-button>

        <b-button 
          outlined
          expanded 
          @click="handleClose"
        >Cancel</b-button>
    </footer>
  </div>
</template>

<script>
  import RefereeForm from "../RefereeForm";
  import Referee from "../../store/models/RefereeClass";

    export default {
      props: ["title", "onSave"],
      data() {
        return {
          referee: new Referee()
        }
      },
      components: {
        RefereeForm
      },
      methods: {
        handleClose() {
          this.$emit('close');
        },
        handleSave() {
          this.onSave(this.referee) && this.$emit('close');
        }
      },
    }
</script>