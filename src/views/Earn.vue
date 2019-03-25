<template>
  <div class="course">
    <h3 class="title">赚取积分</h3>
    <el-button type="primary" size="medium" class="btn" @click="addTask">新增任务</el-button>
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
        prop="name"
        label="任务名称"></el-table-column>
      <el-table-column
        align="center"
        prop="reward"
        label="奖励积分"></el-table-column>
      <el-table-column
        align="center"
        prop="type"
        label="类型"></el-table-column>
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
      <el-form :model="taskInfo" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskInfo.name" placeholder="请填写课程名称"></el-input>
        </el-form-item>
        <el-form-item label="奖励积分" prop="reward">
          <el-input v-model="taskInfo.reward" placeholder="请填写教练姓名"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model.number="taskInfo.type" placeholder="请填写课程人数"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" size="medium">确定</el-button>
          <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { delTask, getTaskList, editTask } from '../common/api'

export default {
  data () {
    return {
      courseList: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      dialogTitle: '新增任务',
      dialogVisible: false,
      taskInfo: {
        name: '',
        reward: '',
        type: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        reward: [
          { required: true, message: '请输入奖励积分', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入任务类型', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getTaskList()
  },
  methods: {
    modify (r) {
      this.taskInfo = { ...r }
      this.dialogTitle = '编辑任务信息'
      this.dialogVisible = true
    },
    // 新建课程提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editTask({ ...this.taskInfo }).then(res => {
            const { code } = res.data
            if (code === 0) {
              this.$notify({
                title: '成功',
                message: '配置课程成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getTaskList()
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
      this.getTaskList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getTaskList()
    },
    deleteItem (r) {
      delTask({
        id: r.id
      }).then(res => {
        const { code } = res.data
        if (code === 0) {
          this.$notify({
            title: '成功',
            message: '删除任务成功',
            type: 'success'
          })
          this.getTaskList()
        } else {
          this.$notify.error({
            title: '错误',
            message: '删除任务失败，请刷新重试',
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
    getTaskList () {
      getTaskList({
        size: this.pageSize,
        page: this.currentPage
      }).then(res => {
        const { code, page } = res.data
        if (code === 0) {
          this.courseList = page.records
          this.total = page.total
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
    addTask () {
      this.taskInfo = {
        name: '',
        reward: '',
        type: ''
      }
      this.dialogTitle = '新增任务'
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
