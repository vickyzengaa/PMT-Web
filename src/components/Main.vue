<template>
  <div class="main-body">
    <el-container>
      <el-header>
        <el-row class="main-el-row" :style="{'background': mainColor}">
          <el-col :span="1" :class="this.$store.getters.getIsShowMainBar == false?'hide-view':''">
            <div class="main-grid-content">
              <el-dropdown @command="handleMenuCommand">
                <el-button :style="{'background-color': btnColor}" class="main-menu-btn" icon="el-icon-menu" size="small"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-date" command="timesheet" class="main-menu-dropdown-text">Timesheet</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-tickets" command="task" class="main-menu-dropdown-text">Task</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-edit-outline" command="management" class="main-menu-dropdown-text">Management</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-paperclip" command="others" class="main-menu-dropdown-text" v-if="false">Others</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
          <el-col :span="5" :class="this.$store.getters.getIsShowMainBar == false?'hide-view':''">
            <div class="main-grid-content" style="justify-content: flex-start;">
              <el-tooltip class="item" effect="dark" content="Timesheet" placement="bottom">
                <el-button icon="el-icon-date" circle @click="handleMenuCommand('timesheet')"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Task List" placement="bottom">
                <el-button icon="el-icon-tickets" circle @click="handleMenuCommand('task')"></el-button>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="main-grid-content">
              <span class="main-logo">{{logo}}</span>
            </div>
          </el-col>
          <el-col :span="6" :class="this.$store.getters.getIsShowMainBar == false?'hide-view':''">
            <div class="main-grid-content" style="justify-content:flex-end;">
              <!-- <el-dropdown trigger="click">
                <el-badge :value="msgValue" :max="10" class="main-user-msg">
                  <el-button type="warning" size="small" icon="el-icon-message-solid" circle></el-button>
                </el-badge>
                <el-dropdown-menu slot="dropdown" class="main-user-msg-panel">
                  <el-dropdown-item>
                    <div class="main-user-msg-panel-i border-bottom-line">You have {{msgValue}} messages !</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-for="msg in msgList" :key="msg.id">
                    <div class="main-user-msg-panel-item border-bottom-line">
                      <div class="msg-icon"><i class="el-icon-message"></i></div>
                      <div class="msg-content"><span class="msg-content-text">{{msg.msg}}</span></div>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div class="main-user-msg-panel-i"><b>Show All</b></div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <el-dropdown trigger="click" style="padding: 0" @command="handleCommand">
                <el-button :style="{'background-color': btnColor}" size="small" icon="el-icon-user-solid" class="main-user-info-btn" round>{{this.$store.getters.getUserEid}}</el-button>
                <el-dropdown-menu slot="dropdown" class="main-user-info-panel">
                  <el-dropdown-item command="theme">
                    <div class="main-user-info-panel-item"><span>Theme</span><div class="main-user-info-panel-colorbox" :style="{'background': mainColor}"></div></div>
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    <div class="main-user-info-panel-item"><b>Logout</b></div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
    <el-dialog title="Theme Style" :visible.sync="centerDialogVisible" width="360px" center>
      <el-table ref="themeTable" :data="themeData" highlight-current-row @current-change="selectTheme"
      style="width: 100%">
        <el-table-column property="themeValue" width="20" v-if="false"></el-table-column>
        <el-table-column property="themeName" label="Theme Name" align="center"></el-table-column>
        <el-table-column property="mainColor" label="Color" width="120" align="center">
          <template slot-scope="scope">
            <div class="main-themestyle">
              <div class="main-themestyle-colorbox" :style="{'background': scope.row.mainColor}"></div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" @click="submitTheme">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
import http from '../utils/http'
import utils from '../utils/utils'
export default {
  name: 'Main',
  data () {
    return {
      logo: 'Project Management Timesheet',
      msgValue: 3,
      centerDialogVisible: false,
      msgList: [{'id': 1, 'msg': 'You have not complete the timesheet from 2019-07-09.'},
        {'id': 2, 'msg': 'TOS Team still need 42 hours to complete the target.'},
        {'id': 3, 'msg': 'Change CGM190061 is over charged.'}],
      themeData: utils.themeStyle,
      currentRow: null,
      mainColor: utils.themeStyle[this.$store.getters.getThemeStyle].mainColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor
    }
  },
  methods: {
    setCurrent (row) {
      console.log(this.$refs)
      this.$nextTick(() => {
        this.$refs.themeTable.setCurrentRow(row);
      })
    },
    selectTheme (val) {
      this.$data.currentRow = Number(val.themeValue)
    },
    async submitTheme() {
      const res = await http.get('/users/setUserThemeStyle', {
        userEid: this.$store.getters.getUserEid,
        uThemeStyle: this.$data.currentRow
      })
      console.log(res)
      if (res.data.status === 0) {
        this.$data.centerDialogVisible = false
        var resUserThemeStyle = Number(res.data.data.ThemeStyle)
        this.$store.dispatch('setNewThemeStyle', resUserThemeStyle)
        this.$router.go(0)
      }
    },
    handleCommand (command) {
      if (command === 'logout') {
        localStorage.setItem('Flag', '')
        localStorage.setItem('UserEid', '')
        this.$store.dispatch('setNewUserEid', '')
        this.$store.dispatch('setNewUserId', '')
        this.$store.dispatch('setNewUserLevel', '')
        this.$store.dispatch('setNewThemeStyle', 0)
        this.$store.dispatch('setHideMainBar')
        this.$router.push({path: '/Login'})
      }
      else if (command === 'theme') {
        this.$data.centerDialogVisible = true
        var index = Number(utils.themeStyle[this.$store.getters.getThemeStyle].themeValue)
        this.setCurrent(this.$data.themeData[index])
      }
    },
    handleMenuCommand (command) {
      if (command === 'timesheet') {
        this.$router.push({path: '/Timesheet'})
      }
      else if (command === 'task') {
        this.$router.push({path: '/Task'})
      }
      else if (command === 'management') {
        this.$router.push({path: '/Management'})
      }
      else if (command === 'others') {
        this.$router.push({path: '/Others'})
      }
    }
  }
}
</script>

<style scoped>
.main-body {
  width: 100%;
  height:auto;
}
.el-header {
  background-color: white;
  text-align: center;
  padding: 0;
  height: 50px;
}
.el-main {
  padding: 0;
}
.main-el-row {
  width: 100%;
  height: 50px;
}
.main-grid-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height: 50px;
}
.main-menu-btn {
  margin-left: 5px;
  height:40px;
  text-align: center;
  font-size: 20px;
  color: white;
  border: none;
}
.main-menu-dropdown-text {
  font-size: 18px;
}
/* main logo style */
.main-logo {
  font-size: 25px;
  color: white;
  font-family: Microsoft YaHei;
}
/* main user info style */
.main-user-info-btn {
  margin-right: 10px;
  width:auto;
  font-size: 15px;
  color: white;
  border: none;
}
.main-user-msg {
  margin-top: 5px;
  margin-right: 23px;
  font-size: 10px;
}
.main-user-info-panel {
  width: 150px;
  padding-top: 6px;
  padding-bottom: 0;
}
.main-user-info-panel-item {
  width:100%;
  height:auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-user-info-panel-colorbox {
  margin-left: 7px;
  width: 20px;
  height: 20px;
  border: 2px solid #bdc3c7;
  border-radius: 6px;
}
.main-themestyle {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-themestyle-colorbox {
  width: 30px;
  height: 30px;
  border: 2px solid #bdc3c7;
  border-radius: 6px;
}
.main-user-info-panel-logout {
  width: 120px;
}
.main-user-msg-panel {
  width: 300px;
  padding: 0;
}
.main-user-msg-panel .el-dropdown-menu__item {
  padding: 0;
}
.main-user-msg-panel-item {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.msg-icon {
  height: 50px;
  width:50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: #ffa502;
}
.msg-content {
  height: 50px;
  width: 250px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msg-content-text {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.main-user-msg-panel-i {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
/*Common Style*/
.border-bottom-line {
  border-bottom: 1px solid #dfe4ea;
}
.hide-view {
  visibility: hidden;
}
</style>
