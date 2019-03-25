<template>
  <el-container class="index">
    <el-header class="header">梦拓达阵系统信息管理平台<span class="quit" @click="quit"><i class="el-icon-refresh"></i>退出</span></el-header>
    <el-container class="container">
      <el-aside width="200px" class="aside">
        <el-menu
          :default-active="defaultActive"
          :default-openeds="defaultOpeneds"
          router
        >
          <el-menu-item index="exchange" style="text-indent: 0; font-size: 16px; font-weight: 700;">
            <i class="el-icon-refresh"></i>
            <span slot="title">兑换管理</span>
          </el-menu-item>
          <el-menu-item index="course" style="text-indent: 0; font-size: 16px; font-weight: 700;">
            <i class="el-icon-date"></i>
            <span slot="title">课程管理</span>
          </el-menu-item>
          <el-menu-item index="goods" style="text-indent: 0; font-size: 16px; font-weight: 700;">
            <i class="el-icon-goods"></i>
            <span slot="title">商品管理</span>
          </el-menu-item>
          <el-menu-item index="earn" style="text-indent: 0; font-size: 16px; font-weight: 700;">
            <i class="el-icon-plus"></i>
            <span slot="title">赚取积分</span>
          </el-menu-item>
          <el-menu-item index="home" style="text-indent: 0; font-size: 16px; font-weight: 700;">
            <i class="el-icon-edit"></i>
            <span slot="title">首页配置</span>
          </el-menu-item>
          <el-menu-item index="user" style="text-indent: 0; font-size: 16px; font-weight: 700;">
            <i class="el-icon-menu"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="account" style="text-indent: 0; font-size: 16px; font-weight: 700;">
            <i class="el-icon-setting"></i>
            <span slot="title">账户密码</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    defaultActive () {
      return this.$route.path.replace('/', '')
    },
    defaultOpeneds () {
      return ['1']
    }
  },
  mounted () {
    // console.log('1')
  },
  methods: {
    quit () {
      localStorage.removeItem('MIDLogInfo')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus">
  .index
    height 100%
    .header
      height 60px
      line-height 60px
      background  #f8f8f8
      font-size 15px
      font-weight 600
      color rgba(77, 77, 77, 1)
      font-family SourceHanSansSC-regular
      .quit
        float right
        left 1361px
        color rgba(255, 87, 34, 1)
        font-size 12px
        font-family SourceHanSansSC-regular
        cursor pointer
        i
          margin-right 10px
    .container
      padding 20px
    .aside
      background #f8f8f8
      h3
        height 70px
        line-height 70px
        text-indent 11px
        font-size 16px
        i
          margin-right 10px
      .el-submenu__title
        font-size 16px
        font-weight 700
        background #f8f8f8
      .el-menu-item
        text-indent 20px
        background #f8f8f8
    .main
      padding 0
</style>
