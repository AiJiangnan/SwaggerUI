<!--
  接口文档Tab页面视图
  next version:
-->
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
        // 单击菜单获取要展示的接口文档
        url: this.$route.query.path,
        // 接口支持的请求方法：GET、POST...
        methods: []
      }
    },
    methods: {
      /**
       * 解析接口中的请求方法，为了防止刷新使用本地存储
       */
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
    /**
     * 加载完后解析一次
     */
    mounted() {
      this.parseApiMethod();
    },
    watch: {
      /**
       * 监听路由改变解析一次
       * @param to
       */
      '$route'(to) {
        this.url = to.query.path;
        this.parseApiMethod();
      }
    }
  }
</script>