<template>
  <div class="card" data-project="{{ path_with_namespace }}" data-project-id="{{ id }}" data-namespace-id="{{ namespace.id }}" data-name="{{ name }}" data-last-activity-at="{{ last_activity_at }}" data-created-at="{{ created_at }}">
    <div class="card-block">
      <h4 class="card-title">{{ project.path_with_namespace }}</h4>
      <p class="card-text">{{ project.description }}</p>

      <small class="card-text text-muted float-left">Last updated {{ project.last_activity_at | relTime }}</small>
      <div class="btn-group-vertical">
        <a href="#" class="btn btn-secondary btn-sm" data-button="options" title="Change settings"><i class="fa fa-cog" aria-hidden="true"></i></a>
        <a href="#" class="btn btn-primary btn-sm" data-button="launch" title="Launch noide"><i class="fa fa-terminal" aria-hidden="true"></i></a>
      </div>
    </div>
  </div>
  </div>

</template>

<script>
export default {
  name: "project-card",

  props: [
    'projId',
    'nofetch'
  ],

  data() {
    return {
      project: {}
    }
  },

  created () {
    if (typeof(this.projId) === 'object') {
      this.project = this.projId;
    } else {
      this.project = this.$model('project', { id: this.projId });
    }

    if (!this.nofetch) {
      this.project.http.fetch();
    }
  }
}
</script>

<style scoped>
.btn-group-vertical {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
}
</style>
