<template>
  <tbody>
  <tr v-for="field in getObject()">
    <td>{{field.name}}</td>
    <td>{{getType(field).desc}}</td>
    <td>无</td>
    <td>{{field.description}}</td>
  </tr>
  </tbody>
</template>

<script>
  export default {
    name: "RespTree",
    data() {
      return {
        definitions: JSON.parse(sessionStorage.definitions)
      }
    },
    props: {
      resp: {type: Array, default: null}
    },
    methods: {
      getObject() {

        if (definition.type === 'object') {
          return definition.properties;
        }
        return [];
      }
    }
  }
</script>