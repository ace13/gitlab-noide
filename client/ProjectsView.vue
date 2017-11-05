<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6">
        <h1>User Projects:</h1>
      </div>
      <div class="col-12 col-md-6">
        <div class="input-group mt-2">
          <input class="form-control" type="text" v-model.lazy.trim="filter.name" placeholder="Filter by name..."/>
          <span class="input-group-btn">
            <button class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Sort by">
              <i class="fa fa-align-left"></i>
            </button>
            <div class="dropdown-menu" id="orderMenu">
              <small class="dropdown-header text-muted">Order by</small>
              <div v-radio:kv.one="sort" @changed="updateSort">
                <a class="dropdown-item" href="#" data-key="name" data-value="asc"><i class="fa fa-fw"></i> Name</a>
                <a class="dropdown-item" href="#" data-key="lastActivityAt" data-value="desc"><i class="fa fa-fw"></i> Last updated</a>
                <a class="dropdown-item" href="#" data-key="lastActivityAt" data-value="asc"><i class="fa fa-fw"></i> Oldest updated</a>
                <a class="dropdown-item" href="#" data-key="createdAt" data-value="desc"><i class="fa fa-fw"></i> Last created</a>
                <a class="dropdown-item" href="#" data-key="createdAt" data-value="asc"><i class="fa fa-fw"></i> Oldest created</a>
              </div>

              <div class="dropdown-divider"></div>
              <div v-radio="filter.namespace_id" @changed="updateFilter">
                <a class="dropdown-item" href="#" data-key v-bind:data-value="user.id"><i class="fa fa-fw"></i> Personal projects</a>
                <a class="dropdown-item" href="#" data-key><i class="fa fa-fw"></i> All projects</a>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="row" id="projectList">
      <transition-group name="flip-list" v-if="projects">
        <project-card v-for="project in projects" v-bind:project-id="project" :key="project"/>
      </transition-group>
      <div class="col-12 pt-3" v-else>
        <div class="card card-warning card-inverse text-center">
          <div class="card-block">
            <h4 class="card-title">No projects found</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "projects-view",

  data() {
    return {
      projects: { },
      filter: { },
      sort: {
        name: 'asc'
      }
    }
  },

  created () {
    // TODO: retrieve projects with axios
  },

  methods: {
    updateSort(ev) {
    },

    updateFilter(ev) {
    }
  },

  directives: {
    radio: {
      bind: (el, binding) => {
        var vm = this;

        $(el).find('[data-key]').each(function() {
          $(this).on('click', function() {
            if (binding.arg === 'kv') {
              var key = $(this).data.key;
              var value = $(this).data.value || null;

              if (binding.modifiers.includes('one') {
                vm.$set(vm[binding.expression], { [key]: value });
              } else {
                vm.$set(vm[binding.expression], key, value);
              }
            } else {
              var value = $(this).data.value || null;

              vm.$set(vm[binding.expression], value);
            }

            el.emit('changed');
          });
        });
      },

      update: (el, binding) => {
        $(el).find('[data-key]').each(function() {
          $(this).removeClass('selected');

          if (binding.arg === 'kv') {
            var key = $(this).data.key;
            var value = $(this).data.value;

            if (binding.value[key] === value) {
              $(this).addClass('selected');
            }
          } else {
            var value = $(this).data.value;
            if (v === binding.value) {
              $(this).addClass('selected');
            }
          }
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
