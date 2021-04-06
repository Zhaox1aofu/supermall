<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!--商品的列表-->
    <cart-list class="cart-list"/>

    <!--底部汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import CartList from "@/views/shopcart/childComps/CartList";
import CartBottomBar from "@/views/shopcart/childComps/CartBottomBar";

import {mapGetters} from 'vuex'

export default {
  name: "Shopcart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // ...mapGetters(['cartLength','cartList'])
    ...mapGetters({
      length: 'cartLength'
    })
  }
}
</script>

<style scoped>
  #cart {
    /*position: relative;*/
   height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    position: relative;
    z-index: 9;
    color: #ffffff;

  }

  .cart-list {
    position: absolute;
    top: 44px;
    bottom: 49px;
    width: 100%;
  }
</style>
