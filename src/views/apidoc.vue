<template>
  <div>
    <h2>{{url}}</h2>
    <p>{{method}}</p>
    <p>{{JSON.stringify(api,null,'...')}}</p>
    <!--<JsonView></JsonView>-->
  </div>
</template>

<script>

  export default {
    name: "apidoc",
    props: {
      url: {type: String, default: ''},
      method: {type: String, default: ''},
      api: {type: Object, default: null}
    },
    data() {
      return {
        definitions: JSON.parse(sessionStorage.definitions)
      }
    }
  }
</script>

<style scoped>

</style>