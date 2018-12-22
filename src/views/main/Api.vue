<template>
  <div>
    <Tabs type="card">
      <TabPane :label="method.method.toUpperCase()" v-for="method in methods" :key="method.method">
        <ApiDoc :url="url" :method="method.method.toUpperCase()" :api="method.api"></ApiDoc>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import ApiDoc from "../../components/ApiDoc";

  export default {
    components: {ApiDoc: ApiDoc},
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