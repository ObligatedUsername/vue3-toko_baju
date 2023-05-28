<template>
    <router-view />
</template>

<script>
export default {
    watch: {
        '$route.name': {
            handler() {
                localStorage.removeItem('currItem');
            }
        },
    },

}
</script>

<style>
#app {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
