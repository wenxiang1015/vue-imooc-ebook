<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          v-model="searchText"
          type="text"
          class="slide-contents-search-input"
          :placeholder="$t('book.searchHint')"
          @click="showSearchPage"
          @keyup.enter.exact="search"
        />
      </div>
      <div
        class="slide-contents-search-cancel"
        @click="hideSearchPage"
        v-if="searchVisible"
      >
        {{ $t("book.cancel") }}
      </div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" alt="" class="slide-contents-book-img" />
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{
            metadata.title
          }}</span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{
            metadata.creator
          }}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{ progress + "%" }}</span>
          <span class="progress-text">{{ $t("book.haveRead2") }}</span>
        </div>
        <div class="slide-contents-book-time">{{ getReadTimeText() }}</div>
      </div>
    </div>
    <scroll
      class="slide-contents-list"
      :top="156"
      :bottom="48"
      ref="scroll"
      v-show="!searchVisible"
    >
      <div
        class="slide-contents-item"
        v-for="(item, index) of navigation"
        :key="index"
        @click="displayContent(item.href)"
      >
        <span
          class="slide-contents-item-label"
          :style="contentItemStyle(item)"
          :class="{ selected: section === index }"
          >{{ item.label }}</span
        >
        <span class="slide-contents-item-page">{{ item.page }}</span>
      </div>
    </scroll>
    <scroll
      class="slide-search-list"
      :top="66"
      :bottom="48"
      v-show="searchVisible"
    >
      <div
        class="slide-search-item"
        v-for="(item, index) of searchList"
        :key="index"
        v-html="item.excerpt"
        @click="displayContent(item.cfi, true)"
      ></div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import Scroll from "../common/Scroll.vue";
import { px2rem } from "../../utils/utils";
export default {
  name: "EbookSlideContents",
  mixins: [ebookMixin],
  components: { Scroll },
  data() {
    return {
      searchVisible: false,
      searchList: null,
      searchText: ""
    };
  },
  methods: {
    doSearch(q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(item =>
          item
            .load(this.currentBook.load.bind(this.currentBook))
            .then(item.find.bind(item, q))
            .finally(item.unload.bind(item))
        )
      ).then(results => Promise.resolve([].concat.apply([], results)));
    },
    showSearchPage() {
      this.searchVisible = true;
    },
    hideSearchPage() {
      this.searchVisible = false;
      this.searchText = "";
      this.searchList = null;
    },
    contentItemStyle(item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      };
    },
    displayContent(target, highlight = false) {
      this.display(target, () => {
        this.hideTitleAndMenu();
        if (highlight) {
          this.currentBook.rendition.annotations.highlight(target);
        }
      });
    },
    search() {
      if (this.searchText && this.searchText.length > 0) {
        this.doSearch(this.searchText).then(list => {
          this.searchList = list.map(item => {
            item.excerpt = item.excerpt.replace(
              this.searchText,
              `<span class="content-search-text">${this.searchText}</span>`
            );
            return item;
          });
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.ebook-slide-contents {
  width: 100%;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      display: flex;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(28);
        font-size: px2rem(12);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        outline: none;
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(50);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      .slide-contents-book-title {
        line-height: px2rem(16);
        @include left;
        font-size: px2rem(14);
        .slide-contents-book-title-text {
          @include ellipsis2(3);
        }
      }
      .slide-contents-book-author {
        margin-top: px2rem(5);
        @include left;
        font-size: px2rem(12);
        .slide-contents-book-author-text {
          @include ellipsis2(2);
        }
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      .slide-contents-book-progress {
        font-size: 0;
        .progress {
          font-size: px2rem(14);
        }
        .progress-text {
          font-size: px2rem(12);
        }
      }
      .slide-contents-book-time {
        font-size: px2rem(12);
        margin-top: px2rem(5);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        flex: 1;
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis;
      }
      .slide-contents-item-page {
        flex: 0 0 px2rem(30);
        font-size: px2rem(10);
        @include right;
      }
    }
  }
  .slide-search-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(16);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>
