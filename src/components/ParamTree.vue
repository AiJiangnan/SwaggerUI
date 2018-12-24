<template>
  <tbody>
  <tr class="data-info">
    <td>
      <Icon :type="show?'ios-arrow-down':'ios-arrow-forward'" style="cursor:pointer;" @click="expandTable"/>
      {{param.name}}
    </td>
    <td>{{type}}</td>
    <td>{{param.description}}</td>
    <td>{{param.required?'是':'否'}}</td>
    <td>{{param.in}}</td>
  </tr>
  <tr v-if="show" v-for="(value,key) in getObject()">
    <td style="padding-left:30px;">{{key}}</td>
    <td>{{value.type}}</td>
    <td>{{value.description}}</td>
    <td></td>
    <td></td>
  </tr>
  </tbody>
</template>

<script>
  export default {
    name: "ParamTree",
    data() {
      return {
        definitions: JSON.parse(sessionStorage.definitions),
        show: false
      }
    },
    props: {
      type: {type: String, default: ''},
      param: {type: Object, default: null}
    },
    methods: {
      getObject() {
        const definition = this.definitions[this.type];
        if (definition.type === 'object') {
          return definition.properties;
        }
        console.log('definitions:', definition);
        return definition;
      },
      expandTable() {
        this.show = !this.show;
      },
    }
  }
</script>