import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './utils/http'

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
  let getFlag = localStorage.getItem('Flag')
  let reqUserEid = localStorage.getItem('UserEid')
  console.log(to.meta)
  if (to.meta.needLogin) {
    if (getFlag === 'isLogin') {
      const res = await http.get('/users/login', {
        userEid: reqUserEid
      })
      if (res.data.status === 0 && res.data.user != null && res.data.user.IsActive) {
        var resUserEid = res.data.user.Name
        var resUserId = res.data.user.Id
        store.dispatch('setNewUserEid', resUserEid)
        store.dispatch('setNewUserId', resUserId)
        store.dispatch('setShowMainBar')
        next()
      } else {
        alert('Your EID is not found or inactive! Please retry or contact administrator!')
        next('/Login')
      }
    } else {
      alert('You need to login first!')
      next('/Login')
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
