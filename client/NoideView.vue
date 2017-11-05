<template>
  <div class="embed-responsive embed-responsive-16by9">
      <iframe cass="embed-responsive-item" src="" allowfullscreen></iframe>
  </div>
</div>

</template>

<script>
export default {
  name: "noide-view",

  props: [
    'projId'
  ],

  data() {
    return {
      project: {}
    }
  },

  created () {
    // TODO: retrieve noide link data with axios
  }
}
</script>

<style scoped>

</style>
