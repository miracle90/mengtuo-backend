<template>
  <div class="course">
    <h3 class="title">课程列表</h3>
    <el-button type="primary" size="medium" class="btn" @click="addCourse">新增课程</el-button>
    <ul>
      <li v-for="(course, index) in courseList" :key="index">
        <el-input v-model="course.contentName" placeholder="请输入课程名称" :disabled="course.state"></el-input>
        <el-button @click="handleClick(index)" class="submit_btn">{{course.state ? '修改' : '确定'}}</el-button>
        <el-button @click="deleteItem(index)" class="submit_btn" type="danger">删除</el-button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      courseList: []
    }
  },
  mounted () {
    this.getCourseList()
  },
  methods: {
    handleClick (index) {
      if (this.courseList[index].state) {
        this.$set(this.courseList, index, {
          id: this.courseList[index].id,
          contentName: this.courseList[index].contentName,
          state: false
        })
      } else {
        if (!this.courseList[index].contentName) {
          this.$notify.error({
            title: '错误',
            message: '课程内容不得为空',
            offset: 100
          })
          return
        }
        // 区分是修改确定还是新增课程确定
        if (this.courseList[index].id) {
          this.axios.post('http://39.98.181.204:8080/mid/teach/updateContent', {
            id: this.courseList[index].id,
            contentName: this.courseList[index].contentName
          }).then(res => {
            const { code } = res.data
            if (code === 0) {
              this.$notify({
                title: '成功',
                message: '修改课程成功',
                type: 'success'
              })
              this.getCourseList()
            } else {
              this.$notify.error({
                title: '错误',
                message: '修改课程失败，请刷新重试',
                offset: 100
              })
            }
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '修改课程失败，请刷新重试',
              offset: 100
            })
          })
        } else {
          this.axios.post('http://39.98.181.204:8080/mid/teach/addContent', {
            contentName: this.courseList[index].contentName
          }).then(res => {
            const { code } = res.data
            if (code === 0) {
              this.$notify({
                title: '成功',
                message: '添加课程成功',
                type: 'success'
              })
              this.getCourseList()
            } else {
              this.$notify.error({
                title: '错误',
                message: '添加课程失败，请刷新重试',
                offset: 100
              })
            }
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '添加课程失败，请刷新重试',
              offset: 100
            })
          })
        }
      }
    },
    deleteItem (index) {
      if (!this.courseList[index].id) {
        this.courseList.splice(index, 1)
        return
      }
      this.axios.post('http://39.98.181.204:8080/mid/teach/delContent', {
        id: this.courseList[index].id
      }).then(res => {
        const { code } = res.data
        if (code === 0) {
          this.$notify({
            title: '成功',
            message: '删除课程成功',
            type: 'success'
          })
          this.getCourseList()
        } else {
          this.$notify.error({
            title: '错误',
            message: '删除课程失败，请刷新重试',
            offset: 100
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '删除课程失败，请刷新重试',
          offset: 100
        })
      })
    },
    getCourseList () {
      this.axios.post('http://39.98.181.204:8080/mid/teach/getContentList', {}).then(res => {
        const { code, list } = res.data
        if (code === 0) {
          this.courseList = list
          this.courseList.map(item => (item.state = true))
        } else {
          this.$notify.error({
            title: '错误',
            message: '查询数据失败，请刷新重试',
            offset: 100
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '查询课程数据失败，请刷新重试',
          offset: 100
        })
      })
    },
    addCourse () {
      this.courseList.push({
        state: false
      })
    }
  }
}
</script>

<style lang="stylus">
  .course
    margin-left 20px
    .title
      padding-bottom 20px
      border-bottom 1px solid #e8e8e8
    .btn
      margin: 20px 0
    ul
      li
        .el-input
          margin-right 20px
          width 200px
          height 60px
          line-height 60px
</style>
