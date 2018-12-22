<template>
  <div class="layout">
    <Layout :style="{height:'100vh'}">
      <Header>
        <h2 style="color:#fff;text-align:left;display:inline-block;" @click="alertInfo">{{resource.label}} <sup>{{info.version}}</sup>
        </h2>
        <Select v-model="selectResource" style="width:200px;float:right;padding:15px 0;" label-in-value
                @on-change="changeResource($event)">
          <Option v-for="item in resources" :value="item.location" :key="item.location">{{item.name}}</Option>
        </Select>
      </Header>
      <Layout>
        <Sider :style="{overflow: 'auto'}" width="280">
          <ApiMenu/>
        </Sider>
        <Layout>
          <Content :style="{padding: '24px',height: '100%'}">
            <Content :style="{background: '#fff'}">
              <router-view/>
            </Content>
          </Content>
        </Layout>
      </Layout>
      <Footer class="layout-footer-center">2017-2019 &copy; CodeArtist</Footer>
    </Layout>
  </div>
</template>
<script>
  import ApiMenu from "../components/ApiMenu";

  export default {
    components: {ApiMenu},
    data() {
      return {
        resources: [],
        resource: {},
        selectResource: '',

        apiDoc: {},
        apiTags: [],
        info: {}
      }
    },
    methods: {
      changeResource(value) {
        this.resource = value;
        console.log('resource:', this.resource);
      },
      getResources(callback) {
        this.ajax.get('/swagger-resources', data => {
          this.resources = data;
          this.resource.label = data[0].name;
          this.resource.value = data[0].location;
          this.selectResource = data[0].location;
          callback();
        });
      },
      getApiDoc() {
        this.ajax.get('/v2/api-docs', {group: this.resource.label}, data => {
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
      this.getResources(() => this.getApiDoc());
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