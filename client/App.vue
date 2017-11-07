<template>
  <div>
    <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse fixed-top">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" arial-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">
        <img alt="B" src="">
      </a>

      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav navbar-right ml-auto" title="Logged in as {{ user.displayName }}" v-if="user">
          <li class="nav-item dropdown">
            <a href="#" class="nav-link dropdown-toggle" id="userDropdownLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <img v-bind:src="user.avatar_url" v-bind:alt="user.username" width="25" height="25" class="rounded-circle"/>
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdownLink">
              <a href="#" class="dropdown-item"><i class="fa fa-fw fa-list"></i> Projects</a>
              <a href="#" class="dropdown-item"><i class="fa fa-fw fa-gears"></i> Settings</a>
              <div class="dropdown-divider"></div>
              <a href="/auth/logout" class="dropdown-item"><i class="fa fa-fw fa-sign-out"></i> Logout</a>
            </div>
          </li>
        </ul>
        <div class="navbar-right" style="margin-right: 0px" v-else>
          <a href="/auth/login" class="btn btn-primary navbar-btn" role="button"><i class="fa fa-sign-in"></i> Login</a>
        </div>
      </div>
    </nav>

    <div class="container my-4" id="app">
      <projects-view></projects-view>
    </div>

    <div id="footer" class="position-static container text-center">
      <h6 class="text-muted font-weight-lite">&lt;Footer&gt;</h6>
    </div>
</template>

<script>
import axios from 'axios';

import NoideView from './NoideView.vue';
import ProjectsView from './ProjectsView.vue';

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
  },

  components: [
    NoideView,
    ProjectsView
  ]
}
</script>

<style scoped>
</style>
