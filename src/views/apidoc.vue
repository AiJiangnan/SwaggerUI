<template>
  <div id="data">
    <table cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td class="data-label">接口分类：</td>
        <td colspan="4">{{api.tags.join()}}</td>
      </tr>
      <tr>
        <td class="data-label">接口名称：</td>
        <td colspan="4">{{api.summary}}</td>
      </tr>
      <tr>
        <td class="data-label">请求地址：</td>
        <td colspan="4"><code>{{url}}</code></td>
      </tr>
      <tr>
        <td class="data-label">请求方式：</td>
        <td colspan="4"><code>{{method}}</code></td>
      </tr>
    </table>
    <table cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td colspan="5" class="data-label">入口参数说明：<code>Content-Type: {{api.consumes.join(';')}}</code></td>
      </tr>
      <tr>
        <td class="data-head">参数名称</td>
        <td class="data-head">数据类型</td>
        <td class="data-head">参数描述</td>
        <td class="data-head">是否必须</td>
        <td class="data-head">参数类型</td>
      </tr>
      <tr v-for="param in api.parameters" v-if="param.type">
        <td class="data-info">{{param.name}}</td>
        <td class="data-info">{{param.type}}</td>
        <td class="data-info">{{param.description}}</td>
        <td class="data-info">{{param.required?'是':'否'}}</td>
        <td class="data-info">{{param.in}}</td>
      </tr>
      <tbody v-else>
      <tr>
        <td class="data-info">{{param.name}}</td>
        <td class="data-info">{{getDefinitionType(param)}}</td>
        <td class="data-info">{{param.description}}</td>
        <td class="data-info">{{param.required?'是':'否'}}</td>
        <td class="data-info">{{param.in}}</td>
      </tr>
      <tr v-for="(val,key) in getDefinitionReq(param)">
        <td class="data-info" style="padding-left:30px;">{{key}}</td>
        <td class="data-info">{{val.type}}</td>
        <td class="data-info">{{val.description}}</td>
        <td class="data-info">{{val.required?'是':'否'}}</td>
        <td class="data-info"></td>
      </tr>
      </tbody>
    </table>
    <table cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td colspan="5" class="data-label">返回结果说明：<code>Content-Type: {{api.produces.join(';')}}</code></td>
      </tr>
      <tr>
        <td class="data-head">参数名称</td>
        <td class="data-head">数据类型</td>
        <td colspan="3" class="data-head">参数描述</td>
      </tr>
      <tr v-for="(val,key) in getDefinition(api.responses['200'])" v-if="val.type && val.type!=='array'">
        <td class="data-info">{{key}}</td>
        <td class="data-info">{{val.type}}</td>
        <td colspan="3" class="data-info">{{val.description}}</td>
      </tr>
      <tbody v-else>
      <tr>
        <td class="data-info">{{key}}</td>
        <td class="data-info">{{getSchemaType(val)}}</td>
        <td colspan="3" class="data-info">{{val.description}}</td>
      </tr>
      <tr v-for="(sVal,sKey) in getDefinitionResp(val)">
        <td class="data-info" style="padding-left:30px;">{{sKey}}</td>
        <td class="data-info">{{sVal.type}}</td>
        <td colspan="3" class="data-info">{{sVal.description}}</td>
      </tr>
      </tbody>
    </table>
    <table cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td colspan="5" class="data-label">响应状态码：</td>
      </tr>
      <tr>
        <td class="data-head">状态码</td>
        <td class="data-head">描述</td>
        <td class="data-head">响应类型</td>
        <td class="data-head">响应内容</td>
        <td class="data-head">响应头</td>
      </tr>
      <tr v-for="(val,key) in api.responses">
        <td class="data-info">{{key}}</td>
        <td class="data-info">{{val.description}}</td>
        <td class="data-info">{{getDefinitionType(val)}}</td>
        <td class="data-info"></td>
        <td class="data-info"></td>
      </tr>
    </table>
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
    },
    methods: {
      getRefName: function (ref) {
        return ref.replace('#/definitions/', '');
      },
      getSchemaType: function (schema) {
        if (!schema) return;
        if (schema.type === 'array') {
          let items = schema.items;
          return 'List<' + (items.type ? items.type : this.getRefName(items.$ref)) + '>';
        } else {
          return this.getRefName(schema.$ref);
        }
      },
      getDefinitionType: function (param) {
        if (param.type) {
          return param.type;
        }
        return this.getSchemaType(param.schema);
      },
      getDefinition: function (param) {
        const ref = this.getRefName(param.schema.$ref);
        const definition = this.definitions[ref];
        return definition.properties;
      },
      getDefinitionResp: function (val) {
        if (val.type === 'array') {
          let items = val.items;
          if (items.type) {
            return;
          }
          return this.definitions[this.getRefName(items.$ref)].properties;
        } else {
          return this.definitions[this.getRefName(val.$ref)].properties;
        }
      },
      getDefinitionReq: function (val) {
        if (val.type === 'array') {
          let items = val.items;
          if (items.type) {
            return;
          }
          return this.definitions[this.getRefName(items.$ref)].properties;
        } else {
          let definition = this.definitions[this.getRefName(val.schema.$ref)];
          console.log(definition);
          const required = definition.required;
          for (let k in definition.properties) {
            definition.properties[k]['required'] = (required.indexOf(k) > -1);
          }
          console.log(definition.properties);
          return definition.properties;
        }
      }
    },
    mounted() {
      console.log(this.api);
    }
  }
</script>

<style scoped>

  #data {
    padding: 20px;
  }

  #data table {
    width: 21cm;
    margin-bottom: 5px;
    border: 2px solid;
  }

  #data td {
    padding: 8px;
    border: 1px solid;
  }

  .data-label {
    width: 3cm;
    background: #eee;
    font-weight: bold;
  }

  .data-head {
    min-width: 100px;
    font-weight: bold;
  }

  .data-head {
    text-align: center;
  }

</style>