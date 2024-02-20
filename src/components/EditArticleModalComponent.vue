<template lang="">
  <div
    id="editModal"
    ref="modal"
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="editModalLabel"
    aria-hidden="true">

    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="editModalLabel" class="modal-title">
            <span>新增文章</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close">
            </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-2">
                <div v-if="!editResult.image" class="mb-3">
                  <label for="imageUrl" class="form-label">輸入圖片網址</label>
                  <input
                    id="imageUrl"
                    type="text"
                    class="form-control"
                    placeholder="請輸入圖片連結"
                    v-model="newImageUrl"
                  />
                </div>
                <img
                  class="img-fluid"
                  :src="editResult.image"
                  alt=""
                />
              </div>
              <div v-if="!editResult.image">
                <button
                  class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="updateImageUrl">
                  新增圖片
                </button>
              </div>
              <div v-else>
                <button
                  class="btn btn-outline-danger btn-sm d-block w-100"
                  @click="deleteImageUrl">
                  刪除圖片
                </button>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  id="title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                  v-model="editResult.title"
                />
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">描述</label>
                <textarea
                  id="description"
                  type="text"
                  rows="5"
                  class="form-control"
                  placeholder="請輸入描述"
                  v-model="editResult.description">
                </textarea>
              </div>

              <div class="mb-3">
                <label for="content" class="form-label">文章內容</label>
                <textarea
                  id="content"
                  type="text"
                  class="form-control"
                  rows="5"
                  placeholder="請輸入文章內容 20 字以內"
                  v-model="editResult.content">
                </textarea>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="author" class="form-label">作者</label>
                  <input
                    id="author"
                    type="text"
                    class="form-control"
                    placeholder="請輸入作者"
                    v-model="editResult.author"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="date" class="form-label">日期</label>
                  <input
                    id="date"
                    type="datetime-local"
                    class="form-control"
                    placeholder="請輸入日期"
                    v-model='createTime'
                  />
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="isPublic"
                    class="form-check-input"
                    type="checkbox"
                    v-model="editResult.isPublic"
                  />
                  <label class="form-check-label" for="isPublic">是否公開</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal">
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmEdit">
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from 'bootstrap'

export default {
  data () {
    return {
      modal: null,
      newImageUrl: '',
      createTime: '',
      editResult: this.editItem
    }
  },
  props: ['editItem'],
  mounted () {
    this.modal = new bootstrap.Modal(this.$refs.modal)
  },
  methods: {
    show () {
      this.modal.show()
    },
    hide () {
      this.modal.hide()
    },
    updateImageUrl () {
      this.editResult.image = this.newImageUrl
      this.newImageUrl = ''
    },
    deleteImageUrl () {
      this.editResult.image = ''
    },
    confirmEdit () {
      this.$emit('update-edit-article', this.editResult)
    }
  },
  watch: {
    editItem (newVal, oldVal) {
      this.editResult = newVal

      if (newVal.create_at) {
        const localTime = new Date(parseInt(newVal.create_at))
        this.createTime = new Date(parseInt(localTime.getTime() - localTime.getTimezoneOffset() * 60000)).toISOString().slice(0, -1)
      } else {
        this.createTime = ''
      }
    },
    createTime (newVal, oldVal) {
      if (parseInt(this.editResult.create_at) !== new Date(newVal).getTime()) {
        this.editResult.create_at = new Date(newVal).getTime()
      }
    }
  }
}
</script>
