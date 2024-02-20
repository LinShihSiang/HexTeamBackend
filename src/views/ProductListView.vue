<template>
  <div class="row py-3">
    <div class="col">
      <div class="text-end mt-4">
        <button class="btn btn-primary" @click.prevent="editProduct()">
          建立新的產品
        </button>
      </div>
      <table class="table table-hover mt-4">
        <thead>
          <tr>
            <th width="150">產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="150">是否啟用</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          <!-- 從 products 產生產品清單，唯一值(key)=id -->
          <tr v-for="item in productsByPage" :key="item.id">
            <td width="150">
              <a href="#" @click.prevent="getProductDetail(item)"
                >{{ item.title }}</a
              >
            </td>
            <td width="120">{{ item.origin_price }}</td>
            <td width="120">{{ item.price }}</td>
            <td width="150">
              <!-- 當 is_enable >= 1 為啟用，否則顯示未啟用 -->
              <span v-if="item.is_enabled >= 1" class="text-success"
                >啟用</span
              >
              <span v-else>未啟用</span>
            </td>
            <td width="120">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click.prevent="editProduct(item)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click.prevent="deleteProduct(item)"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 顯示產品種類數量 -->
      <p>總計 <span v-text="products.length"></span> 項產品</p>

      <pagination-component
        :total-page="totalPage"
        @current-page-num="updateCurrentPageNum">
      </pagination-component>
    </div>

    <delete-product-modal-component
      :product-detail="productDetail"
      :confirm-delete="confirmDelete"
      ref="delModal">
    </delete-product-modal-component>

    <EditProductModalComponent
      :edit-item="editItem"
      @update-edit-product="updateEditProduct"
      ref="editProductModal">
    </EditProductModalComponent>

    <product-modal-component
      :product-detail="productDetail"
      ref="productModal">
    </product-modal-component>
  </div>
</template>
<script>
import axios from 'axios'
import DeleteProductModalComponent from '../components/DeleteProductModalComponent.vue'
import EditProductModalComponent from '../components/EditProductModalComponent.vue'
import PaginationComponent from '../components/PaginationComponent.vue'
import ProductModalComponent from '../components/ProductModalComponent.vue'

const productCountPerPage = 3
const token = document.cookie
  .split('; ')
  .find((row) => row.startsWith('hextoken='))
  ?.split('=')[1]

axios.defaults.headers.common.Authorization = token

export default {
  data () {
    return {
      productDetail: {}, // 暫存產品詳細
      products: [],
      editItem: {},
      newImageUrl: '',
      is_addProduct: false,
      currentPageNum: 1
    }
  },
  mounted () {
    this.checkSignIn()
  },
  computed: {
    productsByPage () {
      const start = productCountPerPage * (this.currentPageNum - 1)

      return this.products.slice(start, start + productCountPerPage)
    },
    totalPage () {
      return Math.ceil(this.products.length / productCountPerPage)
    }
  },
  methods: {
    checkSignIn () {
      axios
        .post(`${import.meta.env.VITE_APP_API_URL}/api/user/check`)
        .then((response) => {
          this.getProducts()
        })
        .catch((error) => {
          alert(error.response.data.message)

          this.$router.push('/')
        })
    },
    getProducts () {
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/${import.meta.env.VITE_APP_API_NAME}/admin/products/all`)
        .then((response) => {
          if (response.data.products == null) {
            this.products = []
            return
          }

          this.products = Object.values(response.data.products)
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    getProductDetail (item) {
      this.productDetail = { ...item }
      this.$refs.productModal.show()
    },
    deleteProduct (item) {
      this.productDetail = { ...item }

      this.$refs.delModal.show()
    },
    confirmDelete () {
      axios
        .delete(`${import.meta.env.VITE_APP_API_URL}/api/${import.meta.env.VITE_APP_API_NAME}/admin/product/${this.productDetail.id}`)
        .then((response) => {
          this.getProducts()

          this.$refs.delModal.hide()
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    editProduct (item = null) {
      this.is_addProduct = item == null

      if (this.is_addProduct) {
        this.editItem = { }
      } else {
        this.editItem = { ...item }
      }

      this.$refs.editProductModal.show()
    },
    confirmEdit () {
      if (this.is_addProduct) {
        this.insertProduct()
      } else {
        this.updateProduct()
      }
    },
    insertProduct () {
      axios
        .post(`${import.meta.env.VITE_APP_API_URL}/api/${import.meta.env.VITE_APP_API_NAME}/admin/product`, {
          data: this.editItem
        })
        .then((response) => {
          this.getProducts()
          this.$refs.editProductModal.hide()
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    updateProduct () {
      axios
        .put(`${import.meta.env.VITE_APP_API_URL}/api/${import.meta.env.VITE_APP_API_NAME}/admin/product/${this.editItem.id}`, {
          data: this.editItem
        })
        .then((response) => {
          this.getProducts()
          this.$refs.editProductModal.hide()
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    updateCurrentPageNum (page) {
      this.currentPageNum = page
    },
    updateEditProduct (item) {
      this.editItem = item
    }
  },
  components: {
    PaginationComponent,
    DeleteProductModalComponent,
    EditProductModalComponent,
    ProductModalComponent
  }
}
</script>

<style lang="css">
  img {
    object-fit: cover;
    max-width: 100%;
  }

  .primary-image {
    height: 300px;
  }

  .images {
    height: 150px;
  }
</style>
