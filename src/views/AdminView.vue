<template>
    <NavBarComponent/>
    <div class="container"> <RouterView /> </div>
</template>
<script>
import NavBarComponent from '../components/NavBarComponent.vue'

export default {
  components: {
    NavBarComponent
  }
}
</script>
