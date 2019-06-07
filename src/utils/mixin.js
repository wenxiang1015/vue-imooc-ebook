import { mapGetters, mapActions } from "vuex";
import { themeList, addCss, getReadTimeByMinute } from "./book";
import { saveLocation, getBookmark } from "./localStorage";
export const ebookMixin = {
  computed: {
    ...mapGetters([
      "fileName",
      "menuVisible",
      "settingVisible",
      "defaultFontSize",
      "defaultFontFamily",
      "fontFamilyVisible",
      "defaultTheme",
      "bookAvailable",
      "progress",
      "section",
      "isPaginating",
      "currentBook",
      "navigation",
      "cover",
      "metadata",
      "paginate",
      "pagelist",
      "offsetY",
      "isBookmark"
    ]),
    themeList() {
      return themeList(this);
    },
    getSectionName() {
      if (this.section) {
        return this.navigation[this.section].label;
      }
      return "";
    }
  },
  methods: {
    ...mapActions([
      "setFileName",
      "setMenuVisible",
      "setSettingVisible",
      "setDefaultFontSize",
      "setDefaultFontFamily",
      "setFontFamilyVisible",
      "setDefaultTheme",
      "setBookAvailable",
      "setProgress",
      "setSection",
      "setIsPaginating",
      "setCurrentBook",
      "setNavigation",
      "setCover",
      "setMetadata",
      "setPaginate",
      "setPagelist",
      "setOffsetY",
      "setIsBookmark"
    ]),
    initGlobalStyle() {
      switch (this.defaultTheme) {
        case "Night":
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`);
          break;
        case "Eye":
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`);
          break;
        case "Gold":
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`);
          break;
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
          break;
      }
    },
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation();
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi;
        const progress = this.currentBook.locations.percentageFromCfi(
          currentLocation.start.cfi
        );
        this.setProgress(Math.floor(progress * 100));
        this.setSection(currentLocation.start.index);
        saveLocation(this.fileName, startCfi);
        const bookmark = getBookmark(this.fileName);
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true);
          } else {
            this.setIsBookmark(false);
          }
        } else {
          this.setIsBookmark(false);
        }
        if (this.pagelist) {
          const totalPage = this.pagelist.length;
          const currentPage = currentLocation.start.location;
          if (currentPage && currentPage > 0) {
            this.setPaginate(currentPage + " / " + totalPage);
          } else {
            this.setPaginate("");
          }
        } else {
          this.setPaginate("");
        }
      }
    },
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation();
          if (cb) {
            cb();
          }
        });
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation();
          if (cb) {
            cb();
          }
        });
      }
    },
    hideTitleAndMenu() {
      this.setMenuVisible(false);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    },
    getReadTimeText() {
      return this.$t("book.haveRead").replace(
        "$1",
        getReadTimeByMinute(this.fileName)
      );
    }
  }
};
export const storeHomeMixin = {
  computed: {
    ...mapGetters(["offsetY", "hotSearchOffsetY", "flapCardVisible"])
  },
  methods: {
    ...mapActions(["setOffsetY", "setHotSearchOffsetY", "setFlapCardVisible"]),
    showBookDetail(book) {
      this.$router.push({
        path: "/store/detail",
        query: {
          fileName: book.fileName,
          category: book.categoryText
        }
      });
    }
  }
};
