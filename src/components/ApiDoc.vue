<!--
  API文档组件
  next version: 添加测试功能，添加响应JSON示例
-->
<template>
  <div id="data">
    <table>
      <tr>
        <td class="data-label">接口分类：</td>
        <td>{{api.tags.join()}}</td>
      </tr>
      <tr>
        <td class="data-label">接口名称：</td>
        <td>{{api.summary}}</td>
      </tr>
      <tr>
        <td class="data-label">请求地址：</td>
        <td><code>{{url}}</code></td>
      </tr>
      <tr>
        <td class="data-label">请求方式：</td>
        <td><code>{{method.toUpperCase()}}</code></td>
      </tr>
    </table>
    <table>
      <tr>
        <td colspan="5" class="data-label">入口参数说明：<code v-if="api.consumes">Content-Type:
          {{api.consumes.join(';')}}</code>
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
      <tr v-for="param in api.parameters" class="data-info" v-if="param.type">
        <td>{{param.name}}</td>
        <td>{{getType(param).desc}}</td>
        <td>{{param.description}}</td>
        <td>{{param.required?'是':'否'}}</td>
        <td>{{param.in}}</td>
      </tr>
      <ParamTree v-else :param="param" :type="getType(param.schema)"/>
    </table>
    <table>
      <tr>
        <td colspan="4" class="data-label">返回结果说明：<code v-if="api.produces">Content-Type:
          {{api.produces.join(';')}}</code>
          <a class="setting" @click="showExampleFnc()">[示例]</a>
        </td>
      </tr>
      <tr class="data-head">
        <td>参数名称</td>
        <td>数据类型</td>
        <td>父级字段</td>
        <td>参数描述</td>
      </tr>
      <tr class="data-info" v-for="field in getResp()">
        <td>{{field.name}}</td>
        <td>{{getType(field).desc}}</td>
        <td>{{field.parent}}</td>
        <td>{{field.description}}</td>
      </tr>
    </table>
    <table>
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
        <td>{{getType(val.schema).desc}}</td>
        <td></td>
        <td></td>
      </tr>
    </table>
    <Drawer title="输入对象参数" width="600" :closable="false" v-model="showParamInfo">
      <table class="info-table">
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
      // TODO
      <!--<Form ref="formTest" :model="formTest" :rules="formTestValid" :label-width="80">
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
      </Form>-->
    </Drawer>
    <Drawer title="示例" width="600" :closable="false" v-model="showExample">
      // TODO
    </Drawer>
  </div>
</template>

<script>
  import ParamTree from "./ParamTree";
  import RespTree from "./RespTree";
  import Parse from "../assets/js/parse";

  export default {
    name: "ApiDoc",
    components: {RespTree, ParamTree},
    props: {
      // 接口的URL
      url: {type: String, default: ''},
      // 接口的请求方法
      method: {type: String, default: ''},
      // 接口的所有信息
      api: {type: Object, default: null}
    },
    data() {
      return {
        /*****************do nothing********************/
        showParamInfo: false,
        showTest: false,
        showExample: false,
        paramInfo: {},
        paramTest: [],
        formTest: {
          $url: this.url
        },
        formTestValid: {}
        /*****************do nothing********************/
      }
    },
    methods: {
      /**
       * 通过对象schema获取类型信息
       * @param schema
       * @returns {*|{name: string, desc: string}}
       */
      getType: schema => Parse.getType(schema),
      /**
       * 获取接口响应数据信息，目前解析三层嵌套状态
       * @returns {Array}
       */
      getResp() {
        const resp = this.api.responses['200'];
        if (!resp) return [];
        let refParam = '';
        if (resp.schema.type === 'array') {
          refParam = resp.schema.items.$ref;
        } else {
          refParam = resp.schema.$ref;
        }
        const res = this.parseResp({ref: refParam, parent: ''});
        let arr = res.respArr;
        res.refs.map(ref => {
          const res2 = this.parseResp(ref);
          arr.push(...res2.respArr);
          res2.refs.map(ref2 => arr.push(...this.parseResp(ref2).respArr));
        });
        return arr;
      },
      /**
       * 解析接口响应数据
       * @param param
       * @returns {{respArr: Array, refs: Array}}
       */
      parseResp(param) {
        const def = Parse.getDefinition(Parse.getRefName(param.ref));
        if (!def) return {respArr: [], refs: []};
        if (def.type === 'object') {
          let respArr = [];
          let refs = [];
          for (let k in def.properties) {
            let res = Object.assign({}, def.properties[k]);
            res.name = k;
            res.parent = param.parent;
            if (res.$ref) {
              refs.push({parent: res.name, ref: res.$ref});
            } else if (res.type === 'array' && res.items.$ref) {
              refs.push({parent: res.name, ref: res.items.$ref});
            }
            respArr.push(res);
          }
          return {respArr: respArr, refs: refs};
        }
      },
      /*****************do nothing********************/
      showTestFnc(params) {
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
      showExampleFnc() {
        this.showExample = true;
      },
      handleSubmit(name) {
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
      handleReset(name) {
        this.formTest = {};
        this.$refs[name].resetFields();
      }
      /*****************do nothing********************/
    }
  }
</script>

<style>

  #data {
    padding: 20px;
  }

  #data table {
    width: 21cm;
    margin-bottom: 5px;
    border: 2px solid;
    border-spacing: 0;
    border-collapse: collapse;
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