<template>
    <section>
        <button class="button is-primary is-medium"
          @click="openModal"
        >
            Launch component modal
        </button>
        
    </section>
</template>

<script>
  import RefereeModal from "../components/modal/NewRefereeModal";
    export default {
      data() {
        return {
        }
      },
      methods: {
        openModal() {
          this.$buefy.modal.open({
            parent : this,
            component: RefereeModal,
            props: {
              title: "New Referee",
              onSave: (referee) => console.log(referee),
            },
            hasModalCard: true,
            canCancel: ['x', 'escape'],
            onCancel: () => { console.log('cancelled') },
          });
        }
      },
    }
</script>