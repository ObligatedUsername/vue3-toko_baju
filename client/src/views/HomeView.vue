<template>

    <NavBar />

    <div class="main">

        <h1>Poster A | Poster B</h1>

        <button @click="$router.push({ path: '/store/0' })">Shop Now!</button>

    </div>

</template>

<script>
import NavBar from '../components/NavBar.vue';

export default {
    components: {
        NavBar,
    },
}
</script>

<style scoped>
button {
    width: 60%;
    height: 25%;
    font-size: 50px;
}

.main {
    height: 100%;
    width: 100%;
    text-align: center;
    justify-content: center;
}
</style>
