<template>
  <div class="layout">
    <Layout :style="{height:'100vh'}">
      <Header>
        <h2 @click="about.show=true">{{resource.label}} <sup>{{apiDoc.info.version || ''}}</sup></h2>
        <About :show="about.show" :content="about" @click="about.show=false"/>
        <Select class="select" v-model="selectResource" label-in-value @on-change="changeResource($event)">
          <Option v-for="(item,index) in resources" :value="item.location" :key="index">{{item.name}}</Option>
        </Select>
      </Header>
      <Layout>
        <Sider :style="{overflow: 'auto'}" width="280">
          <ApiMenu :menus="apiMenu" :paths="apiDoc.paths"/>
        </Sider>
        <Layout>
          <Content :style="{padding: '24px',height: '100%'}">
            <Content :style="{background: '#fff'}">
              <router-view/>
            </Content>
          </Content>
        </Layout>
      </Layout>
      <Footer class="layout-footer-center">2017-{{new Date().getFullYear()}} &copy; CodeArtist</Footer>
    </Layout>
  </div>
</template>

<script>
  import ApiMenu from "../components/ApiMenu";
  import About from "../components/About";

  export default {
    components: {About, ApiMenu},
    data() {
      return {
        resources: [],
        resource: {},
        selectResource: '',
        apiDoc: {
          info: {}
        },
        apiMenu: [],
        about: {show: false}
      }
    },
    methods: {
      changeResource(value) {
        this.resource = value;
        this.getApiDoc();
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
        this.ajax.get(this.selectResource, data => {
          this.apiDoc = data;
          sessionStorage.definitions = JSON.stringify(data.definitions);
          this.parseAbout();
          this.parseApiMenu();
        });
      },
      parseAbout() {
        let [about, apiDoc] = [this.about, this.apiDoc];
        about.title = apiDoc.info.title;
        about.host = apiDoc.host;
        about.version = apiDoc.info.version;
        about.description = apiDoc.info.description;
        about.swagger = apiDoc.swagger;
      },
      parseApiMenu() {
        const [tags, paths] = [this.apiDoc.tags, this.apiDoc.paths];
        let menusArr = this.apiMenu;
        for (let i = 0, n = tags.length; i < n; i++) {
          let menus = {};
          menus.name = tags[i].name;
          menus.description = tags[i].description;
          let smArr = [];
          for (let path in paths) {
            for (let methods in paths[path]) {
              const method = paths[path][methods];
              if (method.tags.indexOf(tags[i].name) > -1) {
                let sm = {};
                sm.name = method.summary;
                sm.description = path;
                sm.url = path;
                smArr.push(sm);
                break;
              }
            }
          }
          menus.menus = smArr;
          menusArr.push(menus);
        }
      }
    },
    mounted() {
      this.getResources(() => this.getApiDoc());
    }
  }
</script>

<style scoped>

  h2 {
    color: #fff;
    text-align: left;
    display: inline-block;
  }

  .select {
    width: 200px;
    float: right;
    padding: 15px 0;
  }

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