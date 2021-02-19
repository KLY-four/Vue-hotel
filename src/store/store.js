import Vue from 'vue'
import vuex from 'vuex'
import makeOrder from '../components/MakeOrder'
Vue.use(vuex)

export default new vuex.Store({
   state:{
     discount:makeOrder.data().form.discount
   }
})
