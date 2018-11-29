<template>
  <div class="layout">
    <Layout :style="{height:'100vh'}">
      <Header>
        <h2 style="color:#fff;text-align:left;">直租侠后台管理系统</h2>
      </Header>
      <Layout>
        <Sider :style="{overflow: 'auto'}">
          <Menu accordion theme="dark" width="auto" @on-select="select($event)">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>
                系统设置
              </template>
              <MenuItem name="admin">用户管理</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
              <MenuItem name="1-4">Option 4</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-filing"></Icon>
                Navigation 2
              </template>
              <MenuItem name="2-1">Option 5</MenuItem>
              <MenuItem name="2-2">Option 6</MenuItem>
            </Submenu>
            <Submenu name="4">
              <template slot="title">
                <Icon type="ios-cog"></Icon>
                Navigation 3
              </template>
              <MenuItem name="4-1">Option 9</MenuItem>
              <MenuItem name="4-2">Option 10</MenuItem>
              <MenuItem name="4-3">Option 11</MenuItem>
              <MenuItem name="4-4">Option 12</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout>
          <Content :style="{padding: '24px',height: '100%'}">
            <Content :style="{padding: '24px', height:'100%', background: '#fff'}">
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
        breadcrumbItem: ''
      }
    },
    methods: {
      select(name) {
        location = '/#/' + name;
      },
      exit(name) {
        if (name === 'exit') {
          this.$store.commit('logout');
          location = '/#/';
        } else if (name === 'reset') {
          this.$Message.success('修改密码');
        }
      }
    }
  }
</script>

<style scoped>


</style>