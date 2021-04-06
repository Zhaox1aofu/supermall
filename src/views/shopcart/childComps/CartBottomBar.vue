<template>
  <div class="bottom-menu">
    <div>
      <check-button :value="isSelectAll"
                    @click.native="checkClick"
                    class="select-all" />
      <span>全选</span>
      <span class="total-price">合计: ¥{{totalPrice}}</span>
      <span class="buy-product" @click="calcClick">去计算({{checkLength}})</span>
    </div>
  </div>
</template>

<script>
import CheckButton from "@/views/shopcart/childComps/CheckButton";

import {mapGetters} from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length

    },
    isSelectAll() {
      if (this.cartList.length === 0) return false
      // 1.使用filter
      // return !(this.cartList.filter(item => !item.checked).length)

      // 2.使用find
      // return  !this.cartList.find(item => !item.checked)

      // 3.普通遍历
      for(let item of this.cartList) {
        if(!item.checked){
          return false
        }
      }
      return true

    }
  },
  methods: {
    checkClick() {//全选按钮
      if(this.isSelectAll) {// 全部选中
        this.cartList.forEach(item => item.checked = false)
      }else { // 部分或全部不选择
        this.cartList.forEach(item => item.checked = true)
      }

    },
    calcClick() {
      if (!this.isSelectAll) {
        this.$toast.show('请选择购买的商品')
      }
    }
  }
}
</script>

<style scoped>
.bottom-menu {
  width: 100%;
  height: 44px;
  background-color: #eee;
  position: fixed;
  bottom: 50px;
  left: 0;
  box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
  font-size: 14px;
  color: #888;
  line-height: 44px;
  padding-left: 35px;
  box-sizing: border-box;
}

.bottom-menu .select-all {
  position: absolute;
  line-height: 0;
  left: 12px;
  top: 13px;
}

.bottom-menu .total-price {
  margin-left: 15px;
  font-size: 16px;
  color: #666;
}

.bottom-menu .buy-product {
  background-color: orangered;
  color: #fff;
  width: 100px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  float: right;
}
</style>
