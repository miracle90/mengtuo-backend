<template>
  <div class="teacher">
    <h3 class="title">用户列表</h3>
    <div class="form-wrapper">
      <el-input
        placeholder="输入用户姓名搜索"
        v-model="searchName"
        size="medium"
        prefix-icon="el-icon-search"
        class="search"
      >
        <el-button slot="append" @click="getList">搜索</el-button>
      </el-input>
      <!-- <el-button type="primary" size="medium" class="btn" @click="addTeacher">新增学生</el-button> -->
    </div>
    <!-- <el-button size="medium" class="btn" @click="exportData" style="margin: 0 10px 20px 0;">导出数据</el-button> -->
    <!-- <span style="margin-right: 10px">时间范围：</span> -->
    <!-- <el-radio v-model="radio" label="0" style="margin-right: 10px;">本月</el-radio> -->
    <!-- <el-radio v-model="radio" label="1" style="margin-right: 50px;">全部</el-radio> -->
    <!-- <span style="margin-right: 10px">所有学生：</span> -->
    <!-- <el-checkbox v-model="allChecked"></el-checkbox> -->
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px;"
      align="center"
    >
      <!-- @selection-change="handleSelectionChange" -->
      <!-- <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column> -->
      <el-table-column
        align="center"
        prop="id"
        label="ID"></el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="姓名"></el-table-column>
      <!-- <el-table-column
        align="center"
        prop="email"
        label="账号"></el-table-column> -->
      <el-table-column
        align="center"
        prop="username"
        label="手机号"></el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="注册时间"></el-table-column>
      <el-table-column
        align="center"
        prop="points"
        label="积分"></el-table-column>
      <el-table-column
        align="center"
        prop="total"
        label="总课时"></el-table-column>
      <el-table-column
        align="center"
        prop="remain"
        label="剩余课时"></el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleTime(scope.row)" type="text" size="small">变更课时</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">变更积分</el-button>
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
    <!-- <el-dialog title="上课历史记录" :visible.sync="dialogTableVisible" width="70%">
      <el-table :data="gridData">
        <el-table-column property="id" label="ID" align="center"></el-table-column>
        <el-table-column property="teacherName" label="老师姓名" align="center"></el-table-column>
        <el-table-column property="email" label="账号" align="center"></el-table-column>
        <el-table-column property="wechat" label="微信号" align="center"></el-table-column>
        <el-table-column property="startTime" label="上课时间" align="center"></el-table-column>
        <el-table-column property="classContent" label="上课内容" align="center"></el-table-column>
        <el-table-column property="statusName" label="状态" align="center"></el-table-column>
      </el-table>
      <el-pagination
        class="record-pagination"
        layout="prev, pager, next"
        @current-change="recordPageChange"
        :current-page="recordPage"
        :page-size="10"
        :total="recordTotal">
      </el-pagination>
    </el-dialog> -->
    <!-- <el-dialog title="新增学生" :visible.sync="dialogAddVisible" width="70%">
      <el-form :model="teacherForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="teacherForm.name" placeholder="请填写学生姓名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="teacherForm.email" placeholder="请填写学生邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="teacherForm.password" type="password" placeholder="请填写密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPsd">
          <el-input v-model="teacherForm.confirmPsd" type="password" placeholder="请再次填写密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" size="medium">确定</el-button>
          <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->
    <!-- 变更积分 -->
    <el-dialog title="变更用户积分" :visible.sync="dialogModifyVisible" width="500px">
      <el-form :model="modifyForm" ref="modifyForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="modifyForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="email">
          <el-input v-model="modifyForm.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="变更类型" prop="resource">
          <el-radio-group v-model="modifyForm.type">
            <el-radio label="1">增加积分</el-radio>
            <el-radio label="0">消费积分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="积分"
          prop="score"
          :rules="[
            { required: true, message: '积分不能为空'},
            { type: 'number', message: '积分必须为数字类型'}
          ]"
        >
          <el-input v-model.number="modifyForm.score" placeholder="请输入积分数值"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateForm('modifyForm')" size="medium">确定</el-button>
          <el-button @click="resetForm('modifyForm')" size="medium">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 变更课时 -->
    <el-dialog title="变更用户课时" :visible.sync="dialogTimeVisible" width="500px">
      <el-form :model="modifyForm" ref="modifyHourForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="modifyForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="email">
          <el-input v-model="modifyForm.mobile" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="变更类型" prop="resource">
          <el-radio-group v-model="modifyForm.type">
            <el-radio label="1">增加积分</el-radio>
            <el-radio label="0">消费积分</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item
          label="总课时"
          prop="total"
          :rules="[
            { required: true, message: '课时不能为空'},
            { type: 'number', message: '课时必须为数字类型'}
          ]"
        >
          <el-input v-model.number="modifyForm.total" placeholder="请输入课时数值"></el-input>
        </el-form-item>
        <el-form-item
          label="剩余课时"
          prop="remain"
          :rules="[
            { required: true, message: '课时不能为空'},
            { type: 'number', message: '课时必须为数字类型'}
          ]"
        >
          <el-input v-model.number="modifyForm.remain" placeholder="请输入课时数值"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateHourForm('modifyHourForm')" size="medium">确定</el-button>
          <el-button @click="resetForm('modifyHourForm')" size="medium">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, userUpdateScore, userUpdateHour } from '../common/api'

export default {
  data () {
    // const validatePass2 = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请再次输入密码'))
    //   } else if (value !== this.teacherForm.password) {
    //     callback(new Error('两次输入密码不一致!'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePass3 = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请再次输入密码'))
    //   } else if (value !== this.modifyForm.password) {
    //     callback(new Error('两次输入密码不一致!'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      // allChecked: false,
      // selectIds: [],
      // radio: '0',
      // teacherId: '',
      searchName: '',
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      // dialogTableVisible: false,
      // gridData: [],
      // recordTotal: 0,
      // recordPage: 1,
      // dialogAddVisible: false,
      // teacherForm: {
      //   name: '',
      //   email: '',
      //   password: '',
      //   confirmPsd: ''
      // },
      // rules: {
      //   name: [
      //     { required: true, message: '请输入用户名', trigger: 'blur' }
      //   ],
      //   email: [
      //     { required: true, message: '请输入邮箱', trigger: 'blur' }
      //   ],
      //   password: [
      //     { required: true, message: '请输入密码', trigger: 'blur' },
      //     { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
      //   ],
      //   confirmPsd: [
      //     { required: true, message: '请确认密码', trigger: 'blur' },
      //     { validator: validatePass2, trigger: 'blur' }
      //   ]
      // },
      dialogModifyVisible: false,
      dialogTimeVisible: false,
      modifyForm: {
        id: '',
        name: '',
        mobile: '',
        type: '1',
        score: '',
        total: 0,
        remain: 0
      }
      // modifyRules: {
      //   password: [
      //     { required: true, message: '请输入密码', trigger: 'blur' },
      //     { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
      //   ],
      //   confirmPsd: [
      //     { required: true, message: '请确认密码', trigger: 'blur' },
      //     { validator: validatePass3, trigger: 'blur' }
      //   ]
      // }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // exportData () {
    //   if (!this.selectIds.length && !this.allChecked) {
    //     this.$notify.error({
    //       title: '错误',
    //       message: '请选择需要导出信息的学生',
    //       offset: 100
    //     })
    //     return
    //   }
    //   const url = `http://39.98.181.204:8080/mid/teach/download?all=${this.allChecked ? '1' : '0'}&time=${this.radio}&ids=${this.selectIds}&type=3`
    //   window.open(url)
    // },
    // handleSelectionChange (val) {
    //   this.selectIds = val.map(item => item.id)
    // },
    updateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { id, type, score: point } = this.modifyForm
          userUpdateScore({
            type,
            id,
            point
          }).then(res => {
            const { code } = res.data
            if (code === 0) {
              this.$notify({
                title: '成功',
                message: '变更用户积分成功',
                type: 'success'
              })
              this.dialogModifyVisible = false
              this.getList()
            } else {
              this.$notify.error({
                title: '错误',
                message: '变更用户积分失败，请刷新重试',
                offset: 100
              })
            }
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '变更用户积分失败，请刷新重试',
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
    updateHourForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { id, total, remain } = this.modifyForm
          userUpdateHour({
            id,
            total,
            remain
          }).then(res => {
            const { code } = res.data
            if (code === 0) {
              this.$notify({
                title: '成功',
                message: '变更用户课时成功',
                type: 'success'
              })
              this.dialogTimeVisible = false
              this.getList()
            } else {
              this.$notify.error({
                title: '错误',
                message: '变更用户课时失败，请刷新重试',
                offset: 100
              })
            }
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '变更用户课时失败，请刷新重试',
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
    // submitForm (formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       const { name, email, password } = this.teacherForm
    //       this.axios.post('http://39.98.181.204:8080/mid/user/insert', {
    //         name,
    //         email,
    //         password,
    //         type: '3'
    //       }).then(res => {
    //         const { code } = res.data
    //         if (code === 0) {
    //           this.$notify({
    //             title: '成功',
    //             message: '新增学生信息成功',
    //             type: 'success'
    //           })
    //           this.dialogAddVisible = false
    //           this.getList()
    //         } else {
    //           this.$notify.error({
    //             title: '错误',
    //             message: '新增学生信息失败，请刷新重试',
    //             offset: 100
    //           })
    //         }
    //       }).catch(() => {
    //         this.$notify.error({
    //           title: '错误',
    //           message: '新增学生信息失败，请刷新重试',
    //           offset: 100
    //         })
    //       })
    //     } else {
    //       this.$notify.error({
    //         title: '错误',
    //         message: '请输入正确的信息！',
    //         offset: 100
    //       })
    //       return false
    //     }
    //   })
    // },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // addTeacher () {
    //   this.dialogAddVisible = true
    // },
    // recordPageChange (val) {
    //   this.recordPage = val
    //   this.handleClick()
    // },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    // 变更积分
    handleClick (r) {
      this.modifyForm.id = r.id
      this.modifyForm.name = r.name
      this.modifyForm.mobile = r.username
      this.dialogModifyVisible = true
    },
    // 变更课时
    handleTime (r) {
      this.modifyForm.id = r.id
      this.modifyForm.name = r.name
      this.modifyForm.total = r.total
      this.modifyForm.remain = r.remain
      this.dialogTimeVisible = true
    },
    // getRecordList () {
    //   this.axios.post('http://39.98.181.204:8080/mid/user/getTeachRecordList', {
    //     type: '3',
    //     limit: '10',
    //     page: this.recordPage + '',
    //     id: this.teacherId
    //   }).then(res => {
    //     const { code, page } = res.data
    //     if (code === 0) {
    //       page.list.forEach(item => {
    //         let { status } = item
    //         item.statusName = status === 0 ? '待上课' : (status === 1 ? '已上课' : '已取消')
    //       })
    //       this.gridData = page.list
    //       this.recordTotal = page.totalCount
    //       this.dialogTableVisible = true
    //     } else {
    //       this.$notify.error({
    //         title: '错误',
    //         message: '查询数据失败，请刷新重试',
    //         offset: 100
    //       })
    //     }
    //   }).catch(() => {
    //     this.$notify.error({
    //       title: '错误',
    //       message: '查询数据失败，请刷新重试',
    //       offset: 100
    //     })
    //   })
    // },
    getList () {
      getUserList({
        size: this.pageSize + '',
        current: this.currentPage + '',
        name: this.searchName
      }).then(res => {
        const { code, page } = res.data
        if (code === 0) {
          // page.records.forEach(item => item.scores = Math.floor(Math.random() * 100))
          this.tableData = page.records
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
          message: '查询数据失败，请刷新重试',
          offset: 100
        })
      })
    }
  }
}
</script>

<style lang="stylus">
  .teacher
    margin-left 20px
    .form-wrapper
      margin 20px 0
      padding-bottom 10px
      border-bottom 1px solid #e8e8e8
      .btn
        float right
    .search
      width 280px
    .pagination
      margin-top 20px
      text-align center
    .record-pagination
      margin 20px 0
      text-align center
</style>
