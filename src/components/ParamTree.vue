<!--
  接口二级入参信息组件
  next version:
-->
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
  <tr v-if="show" v-for="(value,key) in parseParam()">
    <td style="padding-left:30px;">{{key}}</td>
    <td>{{getType(value).desc}}</td>
    <td>{{value.description}}</td>
    <td></td>
    <td></td>
  </tr>
  </tbody>
</template>

<script>
  import Parse from "../assets/js/parse";

  /**
   * Java基本数据类型的包装类，不用解析引用
   * @type {string[]}
   */
  const baseType = ['Byte', 'Short', 'Integer', 'Long', 'Float', 'Double', 'String', 'Character', 'Boolean'];

  export default {
    name: "ParamTree",
    data() {
      return {
        // 展示下级字段状态控制
        show: false,
        // 是否为基本数据类型
        isBaseType: false
      }
    },
    props: {
      type: {type: Object, default: null},
      param: {type: Object, default: null}
    },
    methods: {
      /**
       * 通过对象schema获取类型信息
       * @param schema
       * @returns {*|{name: string, desc: string}}
       */
      getType: schema => Parse.getType(schema),
      /**
       * 解析二级参数
       * @returns {*}
       */
      parseParam() {
        if (this.isBaseType) {
          return;
        }
        const definition = Parse.getDefinition(this.type.name);
        if (definition.type === 'object') {
          return definition.properties;
        }
        return definition;
      }
    },
    /**
     * 创建组件完后判断是否为基本数据类型
     */
    created() {
      this.isBaseType = baseType.indexOf(this.type.name) > -1;
    }
  }
</script>