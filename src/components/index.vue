<template>
  <div class="layout">
    <Layout :style="{height:'100vh'}">
      <Header>
        <h2 style="color:#fff;text-align:left;" @click="alertInfo">{{project}} <sup>{{info.version}}</sup></h2>
      </Header>
      <Layout>
        <Sider :style="{overflow: 'auto'}" width="280">
          <Menu accordion theme="dark" width="auto" @on-select="select($event)">
            <Submenu v-for="(tag,index) in apiDoc.tags" :name="index" :title="tag.description" :key="index">
              <template slot="title">{{tag.name}}</template>
              <MenuItem v-for="menu in tag.paths" :style="{padding:'10px 30px'}" :name="menu.url" :key="menu.url">
                {{menu.name}}
              </MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout>
          <Content :style="{padding: '24px',height: '100%'}">
            <Content :style="{background: '#fff'}">
              <router-view/>
            </Content>
          </Content>
        </Layout>
      </Layout>
      <Footer class="layout-footer-center">2017-2018 &copy; CodeArtist</Footer>
    </Layout>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        project: '',
        apiDoc: {},
        apiTags: [],
        info: {}
      }
    },
    methods: {
      getResources(callback) {
        this.ajax.get('/swagger-resources', data => {
          this.project = data[0].name;
          callback(data[0].name);
        });
      },
      getApiDoc(project) {
        this.ajax.get('/v2/api-docs', {group: project}, data => {
          this.apiDoc = data;
          this.info = data.info;
          sessionStorage.paths = JSON.stringify(data.paths);
          sessionStorage.definitions = JSON.stringify(data.definitions);
          this.init();
        });
      },
      alertInfo() {
        const content = `
          <b>主机: </b><span>${this.apiDoc.host}</span><br>
          <b>版本: </b><span>${this.info.version}</span><br>
          <b>描述: </b><span>${this.info.description}</span><br>
          <b>Swagger: </b><span>${this.apiDoc.swagger}</span><br>
          <b>UI: </b><span>Code Artist</span>`;
        this.$Modal.info({
          title: this.info.title,
          content: content
        });
      },
      init() {
        const tags = this.apiDoc.tags;
        let paths = this.apiDoc.paths;
        for (let i = 0, n = tags.length; i < n; i++) {
          let menu = [];
          for (let path in paths) {
            for (let methods in paths[path]) {
              let method = paths[path][methods];
              if (method.tags.indexOf(tags[i].name) > -1) {
                method.url = path;
                method.name = method.summary;
                menu.push(method);
              }
            }
          }
          tags[i].paths = menu;
        }
      },
      select(name) {
        this.$router.push({name: 'api', query: {path: name}});
      }
    },
    mounted() {
      this.getResources(project => {
        this.getApiDoc(project);
      });
    }
  }
</script>

<style scoped>

  .layout-footer-center {
    padding: 0;
    width: 100%;
    height: 30px;
    color: #fff;
    background: #515a6e;
    text-align: center;
    line-height: 30px;
  }

</style>