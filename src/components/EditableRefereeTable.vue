<template>
  <b-table :data="referees" class="no-margin-on-control" hoverable>
    <template slot-scope="props">
        <b-table-column field="name" label="Name" width="190">
            {{ props.row.firstName }}  {{ props.row.lastName }}
        </b-table-column>
        <b-table-column field="games" label="Games as referee" centered>
          <b-numberinput 
            controls-position="compact" 
            v-model="props.row.games"
            @input="update(props.row)"
            v-if="isEditable(props.row)"
          />
          <span v-else>{{ props.row.games }}</span>
        </b-table-column>
        <b-table-column field="tenSeconds" label="Games as 10s / official" centered>
          <b-numberinput 
            controls-position="compact" 
            v-model="props.row.tenSeconds"
            @input="update(props.row)"
            v-if="isEditable(props.row)"
          />
          <span v-else>{{ props.row.tenSeconds }}</span>
        </b-table-column>
        <b-table-column field="id" v-if="editable">
          <b-tooltip 
            label="Remove referee from tournament"
            position="is-bottom"
            type="is-danger"
            v-if="isEditable(props.row)"
          >
            <b-button 
              @click="removeRow(props.row)" 
              icon-left="close"
              type="is-danger"
              outlined
            />
          </b-tooltip>
        </b-table-column>
      </template>
  </b-table>
</template>
<style>
.no-margin-on-control .field p.control {
  margin-bottom: 0px;
}
</style>
<script>
export default {
  data(){
    return {
      referees: this.value
    };
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    editableItem: {
      type: String,
      default: "all"
    }
  },
  methods: {
    isEditable: function(row) {
      return this.editable && (this.editableItem == "all" || this.editableItem == row.id);
    },
    update({ id, games = 0, tenSeconds = 0 }) {
      const indx = this.referees.find( r => r.id == id);
      this.referees[indx] = {
        ...this.referees[indx],
        games,
        tenSeconds
      };
      
      this.$emit('input', this.referees);
    }
  }
}
</script>