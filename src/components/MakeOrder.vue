<template>
  <div id="makeOrder">
    <mu-container class="container">
      <mu-row>
        <mu-appbar class="appBar" color="primary">
          <mu-icon value="inbox" slot="left"></mu-icon>
          <span>正在预订</span>
        </mu-appbar>
      </mu-row>
      <mu-card raised>
        <mu-card-title :title="roomType.roomType" :sub-title="roomType.remark">
        </mu-card-title>
        <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: blue">房间号选择：</span>
        <select v-model="form.roomId" style="color: red" :rules="phoneRules">
          <option v-for="(s) in roomId" :value="s">{{s}}</option>
        </select>-->
        <mu-card-text>
          <mu-form :model="form" class="mu-demo-form">

            <mu-form-item prop="roomId"  icon="touch_app" label="房间号（不选则由系统自动分配房间）"  label-float>
              <mu-select  prop="roomId" v-model="form.roomId"  >
                <mu-option v-for="(v) in roomId" :value="v" :label="v" >{{v}}</mu-option>
              </mu-select>
            </mu-form-item>

            <mu-form-item prop="name" :rules="nameRules" icon="person" label="入住人" label-float>
              <mu-text-field prop="name" :rules="nameRules" v-model="form.name"></mu-text-field>
            </mu-form-item>

            <mu-form-item icon="phone"
                          :rules="phoneRules"
                          prop="phone" label="联系手机" label-float>
              <mu-text-field  @blur="Ipchecke(form.phone)" @focus="Ipchecke1(form.phone)" v-model="form.phone" prop="phone"></mu-text-field>
              <div id="div1"></div>
            </mu-form-item>
            <mu-date-input icon="today" label="入住日期" :min-date="minDate" v-model="form.orderDate"
                           format="YYYY 年 MM 月 DD 日入住" label-float full-width></mu-date-input>
            <mu-date-input icon="today" :disabled="form.orderDate == null" label="离店日期" :min-date="form.orderDate"
                           v-model="leaveDate" format="YYYY 年 MM 月 DD 日离店" label-float full-width></mu-date-input>
            <mu-form-item icon="access_time">
              <mu-button flat color="primary">共{{ form.orderDays }}晚</mu-button>
            </mu-form-item>
          </mu-form>
          <mu-button color="primary" v-if="vip=='true'" style="width: 100%" flat="">订单消费总共 ￥ {{
            (form.orderCost*(form.discount/10)).toFixed(2) }}
          </mu-button>
          <mu-button color="primary" v-else style="width: 100%" flat="">订单消费总共 ￥ {{form.orderCost.toFixed(2) }}
          </mu-button>
        </mu-card-text>
        <mu-card-actions>
          <mu-button color="secondary" style="width: 49%" @click="goBack">取消</mu-button>
          <!--<mu-button>Action 1</mu-button>-->
          <mu-button color="primary" style="width: 49%" @click="submitOrder">提交订单</mu-button>
        </mu-card-actions>
      </mu-card>
    </mu-container>
  </div>
</template>

<script>
  import {getRoomTypeById} from "@/api/roomType";
  import {addOrder} from "@/api/order";
  import Cookie from 'js-cookie'

  export default {
    name: "MakeOrder",
    data() {
      return {
        roomId: '',
        nameRules: [
          {validate: (val) => !!val, message: '必须填写入住人'},
        ],
        phoneRules: [
          {validate: (val) => !!val, message: '必须填写联系手机号'},
        ],
        roomRules: [
          {validate: (val) => !!val, message: '请选择房间号'},
        ],
        minDate: new Date(),
        minDate2: null,
        leaveDate: null,
        roomTypeId: null,
        cost: null,
        vip: Cookie.get("vip"),

        roomType: {
          roomType: null,

        },
        form: {
          orderTypeId: 2,
          orderType: '官网预订',
          userId: Cookie.get("user_id"),
          name: null,
          phone: null,
          roomTypeId: null,
          roomType: null,
          orderDate: null,
          orderDays: 0,
          orderStatus: 0,
          orderCost: 0,
          discount: 0,
          roomId: '',
          vip: Cookie.get("vip")
        }
      }
    },

    created: function () {
      this.fetchData()
    },
    watch: {
      leaveDate: function () {
        var date1 = new Date(this.form.orderDate);
        var date2 = new Date(this.leaveDate)
        this.form.orderDays = Math.floor(Math.abs(date1 - date2) / 1000 / 60 / 60 / 24 + 0.5);
        this.form.orderCost = this.form.orderDays * this.roomType.price
      }
    },
    methods: {
      Ipchecke(value){
        console.log(value)
        if(value==null || value==''){
          return false;
        }
        var reg = /^1[3456789]\d{9}$/;
        if(!reg.test(value)){
          document.getElementById("div1").innerHTML="<span style='color: red;font-size: small'>手机号不合法</span>"
          return false;
        }
        return true;
      },
      Ipchecke1(value){
        document.getElementById("div1").innerHTML=''
      },
      fetchData() {
        this.roomTypeId = this.$route.params.typeId
        this.form.roomTypeId = this.roomTypeId
        if (this.roomTypeId == null) {
          this.$router.back()
          return
        }
        getRoomTypeById(this.roomTypeId).then(res => {
          this.roomType = res.data;
          this.form.roomType = this.roomType.roomType
          this.form.discount = res.data.discount
          this.roomId = res.data.roomId
          console.log(this.roomId)
        })
      },
      goBack() {
        this.$router.back()
      },

      submitOrder() {
        for (var item in this.form) {
          if (this.form[item] == null) {
            this.$toast.warning("所填信息不能有空！")
            return
          }
        }
        // this.form.orderDate = this.form.orderDate.toString()
        addOrder(this.form).then(res => {
          const re = res;
          if (re.code === 1000) {
            this.$toast.success(re.message)
            this.$router.push('/order')
          } else {
            this.$toast.success(re.message)
          }
        }).catch(err => {
          this.$toast.error(err.toString())
        })
      }
    }
  }
</script>

<style scoped>
  .appBar {
    height: 40px;
    /*width: 100%;*/
    border-radius: 15px;
    margin: 10px;
    color: #fff;
    padding: 10px;
  }

  .container {
    padding: 10px;
  }

  .mu-demo-form {
    width: 100%;
    /*max-width: 460px;*/
  }
</style>
