<template>
  <tbody>
  <tr class="data-info">
    <td>
      <Icon :type="show?'ios-arrow-down':'ios-arrow-forward'" style="cursor:pointer;" @click="show=!show"
            v-if="!isBaseType"/>
      {{param.name}}
    </td>
    <td>{{type.desc}}</td>
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
  const baseType = ['Byte', 'Short', 'Integer', 'Long', 'Float', 'Double', 'String', 'Character', 'Boolean'];

  export default {
    name: "ParamTree",
    data() {
      return {
        definitions: JSON.parse(sessionStorage.definitions),
        show: false,
        isBaseType: false
      }
    },
    props: {
      type: {type: Object, default: null},
      param: {type: Object, default: null}
    },
    methods: {
      getObject() {
        if (this.isBaseType) {
          return;
        }
        const definition = this.definitions[this.type.name];
        if (definition.type === 'object') {
          return definition.properties;
        }
        return definition;
      }
    },
    created() {
      this.isBaseType = baseType.indexOf(this.type.name) > -1;
    }
  }
</script>