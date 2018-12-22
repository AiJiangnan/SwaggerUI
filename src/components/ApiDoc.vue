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
        <td colspan="5" class="data-label">入口参数说明：<code>Content-Type: {{api.consumes.join(';')}}</code>
          <a class="setting" @click="showTestFnc(api.parameters)">[测试]</a>
        </td>
      </tr>
      <tr class="data-head">
        <td>参数名称</td>
        <td>数据类型</td>
        <td>参数描述</td>
        <td>是否必须</td>
        <td>参数类型</td>
      </tr>
      <tr v-for="param in api.parameters" class="data-info">
        <td>{{param.name}}</td>
        <td v-if="param.type">{{param.type}}</td>
        <td v-else><a @click="showParamInfoFnc(param.schema)">{{getSchemaType(param.schema)}}</a></td>
        <td>{{param.description}}</td>
        <td>{{param.required?'是':'否'}}</td>
        <td>{{param.in}}</td>
      </tr>
    </table>
    <table cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td colspan="5" class="data-label">返回结果说明：<code>Content-Type: {{api.produces.join(';')}}</code>
          <a class="setting" @click="showExampleFnc()">[示例]</a>
        </td>
      </tr>
      <tr class="data-head">
        <td>参数名称</td>
        <td>数据类型</td>
        <td colspan="3">参数描述</td>
      </tr>
      <tr class="data-info" v-for="(val,key) in getDefinition(api.responses['200'])"
          v-if="val.type && val.type!=='array'">
        <td>{{key}}</td>
        <td>{{val.type}}</td>
        <td colspan="3">{{val.description}}</td>
      </tr>
      <tbody v-else>
      <tr class="data-info">
        <td>{{key}}</td>
        <td>{{getSchemaType(val)}}</td>
        <td colspan="3">{{val.description}}</td>
      </tr>
      <tr class="data-info" v-for="(sVal,sKey) in getDefinitionResp(val)">
        <td style="padding-left:30px;">{{sKey}}</td>
        <td>{{sVal.type}}</td>
        <td colspan="3">{{sVal.description}}</td>
      </tr>
      </tbody>
    </table>
    <table cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td colspan="5" class="data-label">响应状态码：</td>
      </tr>
      <tr class="data-head">
        <td>状态码</td>
        <td>描述</td>
        <td>响应类型</td>
        <td>响应内容</td>
        <td>响应头</td>
      </tr>
      <tr class="data-info" v-for="(val,key) in api.responses">
        <td>{{key}}</td>
        <td>{{val.description}}</td>
        <td>{{val.type || getSchemaType(val.schema)}}</td>
        <td></td>
        <td></td>
      </tr>
    </table>
    <Drawer title="输入对象参数" width="600" :closable="false" v-model="showParamInfo">
      <table cellspacing="0" cellpadding="0" border="0" class="info-table">
        <tr class="data-head">
          <td>参数名称</td>
          <td>数据类型</td>
          <td>参数描述</td>
          <td>是否必须</td>
        </tr>
        <tr class="data-info" v-for="(val,key) in paramInfo.properties">
          <td>{{key}}</td>
          <td>{{val.type}}</td>
          <td>{{val.description}}</td>
          <td>{{val.required?'是':'否'}}</td>
        </tr>
      </table>
    </Drawer>
    <Drawer title="测试" width="600" :closable="false" v-model="showTest">
      <Form ref="formTest" :model="formTest" :rules="formTestValid" :label-width="80">
        <FormItem label="url">
          <Input v-model="formTest.$url" disabled></Input>
        </FormItem>
        <FormItem v-for="param in paramTest" :label="param.name" :prop="param.name" :key="param.name">
          <Input v-model="formTest[param.name]" type="textarea" v-if="param.in==='body'"
                 placeholder="请输入JSON字符串..."></Input>
          <Input v-model="formTest[param.name]" v-else :placeholder="'请输入'+param.description+'...'"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formTest')">提交</Button>
          <Button style="margin-left: 8px" @click="handleReset('formTest')">重置</Button>
        </FormItem>
      </Form>
    </Drawer>
    <Drawer title="示例" width="600" :closable="false" v-model="showExample">
      todo
    </Drawer>
  </div>
</template>

<script>

  export default {
    name: "ApiDoc",
    props: {
      url: {type: String, default: ''},
      method: {type: String, default: ''},
      api: {type: Object, default: null}
    },
    data() {
      return {
        definitions: JSON.parse(sessionStorage.definitions),
        showParamInfo: false,
        showTest: false,
        showExample: false,
        paramInfo: {},
        paramTest: [],
        formTest: {
          $url: this.url
        },
        formTestValid: {}
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
      showParamInfoFnc: function (schema) {
        let ref = '';
        if (schema.type === 'array') {
          let items = schema.items;
          if (items.type) {
            this.paramInfo = {};
            return;
          }
          ref = items.$ref;
        } else {
          ref = schema.$ref;
        }
        let param = this.definitions[this.getRefName(ref)];
        const required = param.required;
        for (let k in param.properties) {
          param.properties[k]['required'] = (required.indexOf(k) > -1);
        }
        this.paramInfo = param;
        this.showParamInfo = true;
      },
      showTestFnc: function (params) {
        if (params) {
          params.map((param, i) => {
            this.formTestValid[param.name] = [{
              required: param.required,
              message: param.name + '不能为空',
              trigger: 'blur'
            }];
          });
        }
        this.paramTest = params;
        this.showTest = true;
      },
      showExampleFnc: function () {
        this.showExample = true;
      },
      getDefinition: function (param) {
        const ref = this.getRefName(param.schema.$ref);
        const definition = this.definitions[ref];
        return definition.properties;
      },
      getDefinitionResp: function (val) {
        let ref = '';
        if (val.type === 'array') {
          let items = val.items;
          if (items.type) {
            return;
          }
          ref = items.$ref;
        } else {
          ref = val.$ref;
        }
        return this.definitions[this.getRefName(ref)].properties;
      },
      handleSubmit: function (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = this.formTest.$url;
            // path 参数使用正则替换url
            let exec = url.match(/{(.*?)}/g);
            if (exec) {
              exec.map((e, i) => {
                const p = e.replace(/{(.*)}/, '$1');
                url = url.replace(e, this.formTest[p]);
              });
            }
            this.formTest.$url = url;
            this.$Message.success('Success!');
          }
        });
        if (!this.api.parameters) {
          this.$Message.success('Success!');
        }
      },
      handleReset: function (name) {
        this.formTest = {};
        this.$refs[name].resetFields();
      }
    },
    mounted() {
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

  #data td, .info-table td {
    padding: 8px;
    border: 1px solid;
  }

  .data-label {
    width: 3cm;
    background: #eee;
    font-weight: bold;
  }

  .data-head {
    font-weight: bold;
    text-align: center;
  }

  .data-head td {
    min-width: 100px;
  }

  .setting {
    float: right;
  }

</style>