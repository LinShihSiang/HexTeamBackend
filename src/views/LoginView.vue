<template>
      <div class="row justify-content-center">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="col-8">
          <form id="form" class="form-signin">
            <div class="form-floating mb-3">
              <input
                type="email"
                class="form-control"
                id="username"
                placeholder="name@example.com"
                required
                autofocus
                v-model="username"
              />
              <label for="username">Email address</label>
            </div>
            <div class="form-floating">
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"
                required
                v-model="password"
                @keyup.enter="clickSignIn"
              />
              <label for="password">Password</label>
            </div>
            <button
              class="btn btn-lg btn-primary w-100 mt-3"
              type="button"
              @click="clickSignIn"
            >
              登入
            </button>
          </form>
        </div>
      </div>
      <p class="mt-5 mb-3 text-muted">&copy; 2021~∞ - 六角學院</p>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    clickSignIn () {
      axios
        .post(`${import.meta.env.VITE_APP_API_URL}/admin/signin`, {
          username: this.username,
          password: this.password
        })
        .then((response) => {
          const { token, expired } = response.data

          // 暫存 cookie 資料
          document.cookie = `hextoken=${token};expires=${new Date(expired)}`

          // 導向產品列表
          this.$router.push('/Admin')
        })
        .catch((error) => {
          alert(error.response.data.error.message)
        })
    }
  }
}
</script>
