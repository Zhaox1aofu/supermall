<template>
  <div class="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            :probe-type="3"
            @scroll="contentScroll"
            ref="scroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

import Scroll from "@/components/common/scroll/Scroll";
import GoodsList from "@/components/content/goods/GoodsList";


import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "@/network/detail";
import {debounce} from "@/common/utils";
import {itemListenerMixin, backTopMixin} from "@/common/mixin";


export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,

    Scroll,
    GoodsList,

  },
  mixins:[itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,


    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      const data = res.result;
      //1.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages

      //2.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      //3.获取店铺信息
      this.shop = new Shop(data.shopInfo)

      //4.保存商品的详情数据
      this.detailInfo = data.detailInfo

      //5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //6.获取评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      //  根据最新的数据，对应的DOM是已经被渲染出来
      //  但是图片依然是没有加载完（目前获取offsetTop不包含其中的图片）
      //  offsetTop值不对的时候，都是因为图片的问题
      // this.$nextTick(() => {
      //   this.themeTopYs = []
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //   console.log(this.themeTopYs);
      // })
    })

    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    // 4.给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)

    }, 200)
  },
  methods: {
    imageLoad() {
      this.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y

      //2.positionY和主题中值进行对比
      // [0, 7000, 9000, 9500, Number.MAX_VALUE]
      // positionY 在  0-7000之间， index = 0
      // positionY 在  7000-9000之间， index = 1
      // positionY 在  9000-9500之间， index = 2
      // positionY 在  9500-非常大的值之间， index = 3

      // positionY 大于等于 9500 ， index = 3

      let length = this.themeTopYs.length
      for(let i = 0; i< length-1; i++){
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i+1])){
          this.currentIndex = i

          this.$refs.nav.currentIndex = this.currentIndex
        }
        // 普通方法
        // if(this.currentIndex !== i && ((i < length-1 && positionY >= this.themeTopYs[i] && positionY <
        //   this.themeTopYs[i+1]) || (i === length -1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex = i
        //   console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
      }

      // 判断显示回到顶部
      this.listenShowBackTop(position)
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // 2.将商品添加到购物车(1.promise 2.mapActions)
      // this.$store.commit('addCart', product)
      this.$store.dispatch('addCart', product).then(res => {
        // this.show = true
        // this.message = res
        // setTimeout(() => {
        //   this.show = false
        //   this.message = ''
        // },1500)

        this.$toast.show(res)
        console.log(res);
      })


    }

  },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener )
  }
}
</script>

<style scoped>
  .detail {
    position: relative;
    z-index: 1;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    background-color: #fff;
    height: calc(100% - 44px - 49px);
  }
</style>
