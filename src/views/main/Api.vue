<template>
  <div>
    <Tabs type="card">
      <TabPane v-for="(m,i) in methods" :label="m.method.toUpperCase()" :key="i">
        <ApiDoc :url="url" :method="m.method" :api="m.api"/>
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
        methods: []
      }
    },
    methods: {
      parseApiMethod() {
        let m = [];
        const methods = JSON.parse(sessionStorage.path);
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
      this.parseApiMethod();
    },
    watch: {
      '$route'(to) {
        this.url = to.query.path;
        this.parseApiMethod();
      }
    }
  }
</script>