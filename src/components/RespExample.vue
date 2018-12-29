<!--
  响应示例JSON
  next version:
-->
<template>
  <div>
    <pre><code>{{JSON.stringify(parseResp,null,2)}}</code></pre>
  </div>
</template>

<script>
  import Parse from "../assets/js/parse";

  export default {
    name: "RespExample",
    props: {
      root: {type: Object, default: null},
      resp: {type: Array, default: null}
    },
    computed: {
      parseResp() {
        if (!this.root) return;
        const rootType = Parse.getType(this.root.schema);
        if (rootType.type === 'string') {
          return 'string';
        } else if (rootType.type === 'integer') {
          return 0;
        } else if (rootType.type === 'array') {
          return Parse.parseArray(rootType);
        } else {
          return Parse.parseObject(rootType);
        }
      }
    }
  }
</script>

<style scoped>
  pre {
    padding: 20px;
    color: white;
    background-color: #151718;
    font-size: 15px;
    border-radius: 10px;
  }
</style>