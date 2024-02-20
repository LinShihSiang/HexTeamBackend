<template>
  <div class="row py-3">
    <div class="col">
      <div class="text-end mt-4">
        <button class="btn btn-primary" @click.prevent="editArticle()">
          建立新的文章
        </button>
      </div>
      <table class="table table-hover mt-4">
        <thead>
          <tr>
            <th width="150">標題</th>
            <th width="120">日期</th>
            <th width="120">作者</th>
            <th width="150">是否公開</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in articlesByPage" :key="item.id">
            <td width="150">
              <span>{{ item.title }}</span>
            </td>
            <td width="120">{{ showDate(item.create_at) }}</td>
            <td width="120">{{ item.author }}</td>
            <td width="150">
              <!-- 當 is_enable >= 1 為啟用，否則顯示未啟用 -->
              <span v-if="item.isPublic >= 1" class="text-success"
                >啟用</span
              >
              <span v-else>未啟用</span>
            </td>
            <td width="120">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click.prevent="editArticle(item)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click.prevent="deleteArticle(item)"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 顯示產品種類數量 -->
      <p>總計 <span v-text="articles.length"></span> 項產品</p>

      <pagination-component
        :total-page="totalPage"
        @current-page-num="updateCurrentPageNum">
      </pagination-component>
    </div>

    <EditArticleModalComponent
      :edit-item="editItem"
      @update-edit-article="updateEditArticle"
      ref="editArticleModal">
    </EditArticleModalComponent>

    <!-- <delete-product-modal-component
      :product-detail="productDetail"
      :confirm-delete="confirmDelete"
      ref="delArticleModal">
    </delete-product-modal-component>

    <product-modal-component
      :product-detail="productDetail"
      ref="productModal">
    </product-modal-component> -->
  </div>
</template>
<script>
import axios from 'axios'
import PaginationComponent from '../components/PaginationComponent.vue'
import EditArticleModalComponent from '../components/EditArticleModalComponent.vue'

const productCountPerPage = 3
const token = document.cookie
  .split('; ')
  .find((row) => row.startsWith('hextoken='))
  ?.split('=')[1]

axios.defaults.headers.common.Authorization = token

export default {
  data () {
    return {
      articleDetail: {}, // 暫存產品詳細
      articles: [],
      editItem: {},
      is_addArticle: false,
      currentPageNum: 1
    }
  },
  mounted () {
    this.checkSignIn()
  },
  computed: {
    articlesByPage () {
      const start = productCountPerPage * (this.currentPageNum - 1)

      return this.articles.slice(start, start + productCountPerPage)
    },
    totalPage () {
      return Math.ceil(this.articles.length / productCountPerPage)
    }
  },
  methods: {
    checkSignIn () {
      axios
        .post(`${import.meta.env.VITE_APP_API_URL}/api/user/check`)
        .then((response) => {
          this.getArticles()
        })
        .catch((error) => {
          alert(error.response.data.message)

          this.$router.push('/')
        })
    },
    getArticles () {
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/${import.meta.env.VITE_APP_API_NAME}/admin/articles`)
        .then((response) => {
          if (response.data.articles == null) {
            this.articles = []
            return
          }

          this.articles = Object.values(response.data.articles)
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    getArticle (id) {
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/${import.meta.env.VITE_APP_API_NAME}/admin/article/${id}`)
        .then((response) => {
          if (response.data.article == null) {
            this.editItem = {}
            return
          }

          this.editItem = response.data.article
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    getArticleDetail (item) {
      this.articleDetail = { ...item }
      this.$refs.articleModal.show()
    },
    deleteArticle (item) {
      this.articleDetail = { ...item }
      this.$refs.delArticleModal.show()
    },
    confirmDelete () {
      axios
        .delete(`${import.meta.env.VITE_APP_API_URL}/api/${import.meta.env.VITE_APP_API_NAME}/admin/article/${this.productDetail.id}`)
        .then((response) => {
          this.getArticles()

          this.$refs.delArticleModal.hide()
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    editArticle (item = null) {
      this.is_addArticle = item == null

      if (this.is_addArticle) {
        this.editItem = { }
      } else {
        this.getArticle(item.id)
      }

      this.$refs.editArticleModal.show()
    },
    confirmEdit () {
      if (this.is_addArticle) {
        this.insertArticle()
      } else {
        this.updateArticle()
      }
    },
    insertArticle () {
      axios
        .post(`${import.meta.env.VITE_APP_API_URL}/api/${import.meta.env.VITE_APP_API_NAME}/admin/article`, {
          data: this.editItem
        })
        .then((response) => {
          this.getArticles()
          this.editItem = {}
          this.$refs.editArticleModal.hide()
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    updateArticle () {
      axios
        .put(`${import.meta.env.VITE_APP_API_URL}/api/${import.meta.env.VITE_APP_API_NAME}/admin/article/${this.editItem.id}`, {
          data: this.editItem
        })
        .then((response) => {
          this.getArticles()
          this.editItem = {}
          this.$refs.editArticleModal.hide()
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    updateCurrentPageNum (page) {
      this.currentPageNum = page
    },
    updateEditArticle (article) {
      this.editItem = article

      this.confirmEdit()
    },
    showDate (ticks) {
      const date = new Date(ticks)
      const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
      const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay()
      const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

      return `${date.getFullYear()}-${month}-${day} ${hour}:${min}:${second}`
    }
  },
  components: {
    PaginationComponent,
    EditArticleModalComponent
  }
}
</script>
