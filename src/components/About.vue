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
      show: {type: Boolean, default: false},
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
      close() {
        this.$emit('click');
      }
    }
  }
</script>