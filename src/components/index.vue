<template>
  <div class="layout">
    <Layout :style="{height:'100vh'}">
      <Header>
        <router-link to="main" style="font-size:1.5em;font-weight:bold;display:inline-block;color:#fff;">直租侠后台管理系统
        </router-link>
        <Dropdown @on-click="exit($event)" :style="{float:'right'}">
          <a class="info-btn" href="javascript:void(0)">艾江南
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="reset">修改密码</DropdownItem>
            <DropdownItem name="exit">退出</DropdownItem>
          </DropdownMenu>
        </Dropdown>
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

  .layout {
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
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

  .info-btn {
    color: #fff;
  }

</style>