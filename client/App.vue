<template>
  <div>
    <div class="container text-center mb-5">
      <h1>&lt;Header&gt;</h1>
    </div>

  <div class="container my-4" id="app">
  </div>

  <div id="footer" class="position-static container text-center">
    <h6 class="text-muted font-weight-lite">&lt;Footer&gt;</h6>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },

  filters: {
    rel_time (date) {
      return require('moment')(date).fromNow();
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

img {
  width: 200px;
  height: 200px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
