<template lang="">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/Admin">Home</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link" to="/Admin/ProductList">產品</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link" to="/Admin/ArticleList">文章</router-link>
            </li>
        </ul>
        </div>
    </div>
    </nav>
</template>
<script>
export default { }
</script>
