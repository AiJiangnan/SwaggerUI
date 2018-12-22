<template>
  <Menu accordion theme="dark" width="auto" @on-select="select($event)">
    <Submenu v-for="(m,i) in menus" :name="i" :title="m.description" :key="i">
      <template slot="title">{{m.name}}</template>
      <MenuItem v-for="(sm,j) in m.menus" :style="{padding:'10px 30px'}" :name="sm.url" :title="sm.description"
                :key="j">
        {{sm.name}}
      </MenuItem>
    </Submenu>
  </Menu>
</template>

<script>
  export default {
    name: "ApiMenu",
    props: {
      menus: {
        type: Array, default() {
          return [
            {
              name: 'menu:1',
              description: 'menu:1',
              menus: [
                {
                  name: 'menu:1-1',
                  description: 'menu:1-1',
                  url: ''
                }
              ]
            }
          ]
        }
      },
      paths: {type: Object, default: null}
    },
    methods: {
      select(path) {
        sessionStorage.path = JSON.stringify(this.paths[path]);
        this.$router.push({name: 'api', query: {path: path}});
      }
    }
  }
</script>