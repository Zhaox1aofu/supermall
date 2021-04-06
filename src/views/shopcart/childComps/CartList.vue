<template>
  <scroll  ref="scroll">
    <div>
      <cart-list-item v-for="(item, index) in cartList"
                      :key="index"
                      :item-info="item"/>
    </div>
  </scroll>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll";
import CartListItem from "@/views/shopcart/childComps/CartListItem";

import { mapGetters } from 'vuex'

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>


</style>
