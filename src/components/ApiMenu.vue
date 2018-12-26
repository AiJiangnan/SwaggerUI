<!--
  菜单组件
  next version:
-->
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
      // 菜单树
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
      // 所有接口的URL路径
      paths: {type: Object, default: null}
    },
    methods: {
      /**
       * 菜单选中事件，选中接口本地存储接口信息并跳转到api视图
       * @param path 选中的接口URL路径
       */
      select(path) {
        sessionStorage.path = JSON.stringify(this.paths[path]);
        this.$router.push({name: 'api', query: {path: path}});
      }
    }
  }
</script>