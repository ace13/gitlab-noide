<template>
  <div>
    <div class="container text-center mb-5">
      <h1>&lt;Header&gt;</h1>
    </div>

  <div class="container my-4" id="app">
    <div v-if="user">
      Signed in as <a v-bind:href="user.web_url"><img class="rounded-circle" v-bind:src="user.avatar_url">{{ user.name }}</img></a>
    </div>
    <div v-else>
      <a href="/auth/login"><i class="fa fa-sign-in"></i> Sign in</a>
    </div>
  </div>

  <div id="footer" class="position-static container text-center">
    <h6 class="text-muted font-weight-lite">&lt;Footer&gt;</h6>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'app',
  data () {
    return {
      user: {}
    }
  },

  created () {
    axios.get('/auth/user').then((u) => {
      this.user = u;
    });
  },

  filters: {
    rel_time (date) {
      return require('moment')(date).fromNow();
    }
  }
}
</script>

<style scoped>
</style>
