<!--
  关于信息组件
  next version: 可以加入帮助文档
-->
<template>
  <Modal v-model="show" :title="content.title" :closable="false" :mask-closable="false">
    <b>主机: </b><span>{{content.host}}</span><br>
    <b>版本: </b><span>{{content.version}}</span><br>
    <b>描述: </b><span>{{content.description}}</span><br>
    <b>Swagger: </b><span>{{content.swagger}}</span><br>
    <b>UI: </b><span>Code Artist</span>
    <div slot="footer">
      <Button type="primary" @click="close">确定</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "About",
    props: {
      // 展示状态控制
      show: {type: Boolean, default: false},
      // 展示内容控制
      content: {
        type: Object, default() {
          return {
            title: '标题',
            host: '',
            version: '',
            description: '',
            swagger: ''
          }
        }
      }
    },
    methods: {
      /**
       * 单击确定按钮关闭
       */
      close() {
        this.$emit('click');
      }
    }
  }
</script>