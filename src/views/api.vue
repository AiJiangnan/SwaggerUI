<template>
  <div>
    <Tabs type="card">
      <TabPane :label="method.method.toUpperCase()" v-for="method in methods">
        <Apidoc :url="url" :method="method.method.toUpperCase()" :api="method.api"></Apidoc>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import Apidoc from "./apidoc";

  export default {
    components: {Apidoc},
    data() {
      return {
        url: this.$route.query.path,
        paths: JSON.parse(sessionStorage.paths),
        methods: []
      }
    },
    methods: {
      init() {
        let m = [];
        let methods = this.paths[this.url];
        for (let method in methods) {
          let ele = {};
          ele.method = method;
          ele.api = methods[method];
          m.push(ele);
        }
        this.methods = m;
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      '$route'(to) {
        this.url = to.query.path;
        this.init();
      }
    }
  }
</script>

<style scoped>

</style>