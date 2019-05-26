<template>
  <div class="course">
    <h3 class="title">课程列表</h3>
    <el-button type="primary" size="medium" class="btn" @click="addCourse">新增课程</el-button>
    <el-table
      :data="courseList"
      border
      style="width: 100%; margin-top: 20px;"
      align="center"
    >
      <el-table-column
        width="60"
        align="center"
        prop="id"
        label="ID"></el-table-column>
      <el-table-column
        align="center"
        prop="contentName"
        label="课程名称"></el-table-column>
      <el-table-column
        align="center"
        prop="teacherName"
        label="教练"></el-table-column>
      <el-table-column
        width="200"
        align="center"
        prop="startTime"
        label="上课时间"></el-table-column>
      <el-table-column
        align="center"
        prop="number"
        label="人数"></el-table-column>
      <el-table-column
        align="center"
        label="学员列表">
        <template slot-scope="scope">
          <el-button @click="view(scope.row.id)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="modify(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deleteItem(scope.row)" type="text" size="small" style="color: red;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="courseInfo" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="courseInfo.name" placeholder="请填写课程名称"></el-input>
        </el-form-item>
        <el-form-item label="教练姓名" prop="teacher">
          <el-input v-model="courseInfo.teacher" placeholder="请填写教练姓名"></el-input>
        </el-form-item>
        <el-form-item label="课程人数" prop="number">
          <el-input v-model.number="courseInfo.number" placeholder="请填写课程人数"></el-input>
        </el-form-item>
        <el-form-item label="上课时间" prop="time">
          <el-date-picker
            v-model="courseInfo.time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" size="medium">确定</el-button>
          <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="学员列表" :visible.sync="dialogVisibleStudent" width="700px">
      <el-table
        :data="tableData"
        border
        style="width: 100%; margin-top: 20px;"
        align="center"
      >
        <el-table-column
          type="index"
          align="center"
          width="50"
          label="序号"></el-table-column>
        <el-table-column
          width="80"
          align="center"
          prop="id"
          label="学员ID"></el-table-column>
        <el-table-column
          width="100"
          align="center"
          prop="name"
          label="姓名"></el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="手机号"></el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="注册时间"></el-table-column>
        <el-table-column
          width="80"
          align="center"
          prop="points"
          label="积分"></el-table-column>
      </el-table>
      <!-- <el-pagination
        class="pagination"
        layout="total, prev, pager, next"
        :total="userTotal">
      </el-pagination> -->
    </el-dialog>
  </div>
</template>

<script>
import { getContentList, addContentApi, deleteContentApi, getUserListByContent } from '../common/api'

export default {
  data () {
    return {
      userTotal: 0,
      tableData: [],
      courseList: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      dialogTitle: '新增课程',
      dialogVisible: false,
      dialogVisibleStudent: false,
      courseInfo: {
        name: '',
        teacher: '',
        number: '',
        time: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        teacher: [
          { required: true, message: '请输入教练姓名', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入课程人数', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择上课时间', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getCourseList()
  },
  methods: {
    view (contentId) {
      this.dialogVisibleStudent = true
      getUserListByContent({
        contentId
      }).then(res => {
        const { code, list } = res.data
        if (code === 0) {
          this.userTotal = list ? list.length : 0
          this.tableData = list
        } else {
          this.$notify.error({
            title: '错误',
            message: '查询学员信息失败，请刷新重试',
            offset: 100
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '网络异常，请刷新重试',
          offset: 100
        })
      })
    },
    modify (r) {
      const { id, contentName: name, teacherName: teacher, number, startTime: time } = r
      this.courseInfo = {
        id,
        name,
        teacher,
        number,
        time
      }
      this.dialogTitle = '编辑课程信息'
      this.dialogVisible = true
    },
    // 新建课程提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { id, name, teacher, number, time } = this.courseInfo
          addContentApi({
            id,
            teacherName: teacher,
            contentName: name,
            startTime: time,
            number
          }).then(res => {
            const { code } = res.data
            if (code === 0) {
              this.$notify({
                title: '成功',
                message: '配置课程成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getCourseList()
            } else {
              this.$notify.error({
                title: '错误',
                message: '配置课程失败，请刷新重试',
                offset: 100
              })
            }
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '网络异常，请刷新重试',
              offset: 100
            })
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '请输入正确的信息！',
            offset: 100
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCourseList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getCourseList()
    },
    deleteItem (r) {
      deleteContentApi({
        id: r.id
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
      getContentList({
        userId: '0',
        type: '0',
        size: this.pageSize + '',
        page: this.currentPage + ''
      }).then(res => {
        const { code, list } = res.data
        if (code === 0) {
          this.courseList = list.records
          this.total = list.total
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
          message: '网络异常，请刷新重试',
          offset: 100
        })
      })
    },
    addCourse () {
      this.courseInfo = {
        name: '',
        teacher: '',
        number: '',
        time: ''
      }
      this.dialogTitle = '新增课程'
      this.dialogVisible = true
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
    .pagination
      margin-top 20px
      text-align center
    ul
      li
        .el-input
          margin-right 20px
          width 200px
          height 60px
          line-height 60px
</style>
