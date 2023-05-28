<template>

    <div class="navbar-main">

        <div class="side">
            {{ $route.name }}
        </div>

        <div class="logo">
            <router-link to="/store/0" :disabled="$route.name === 'store'"><h1>Toko Baju</h1></router-link>
        </div>
        
        <div class="side">

            <div class="store" v-if="$route.name === 'store'">
                <router-link to="/cart/0">({{ cartCount || '0' }}) Cart</router-link>
            </div>

            <div class="cart" v-if="$route.name === 'cart'">
                <router-link to="/checkout">({{ cartCount || '0' }}) Checkout!</router-link><br>
                <button @click="redirect('remove-order')">Remove Order</button>
            </div>

            <div class="dashboard-admin" v-if="$route.name === 'dashboard-admin'">
                <button @click="redirect('remove-items')"><h4>({{ itemsToRemove.length }})Remove</h4></button>
                <button @click="redirect('add-item')"><h4>Add</h4></button>
            </div>

        </div>

    </div>

</template>

<script>
import DBService from '@/services/DBService';

export default {
    props: [ 'cartCount', 'itemsToRemove' ],

    methods: {
        async removeItems() {
            this.itemsToRemove.forEach(async itemId => {
                await DBService.removeItem({ itemId: itemId });
            });
            this.$emit('updateItems');
        },

        redirect(parameter) {
            this.$router.push('/' + this.$route.name + '/' + ((this.$route.params.item === parameter) ? '0' : parameter));
        },
    },

    watch: {
        '$route.params.item': {
            handler(_, oldVal) {
                if (oldVal === 'remove-items') this.removeItems();
            },
            deep: true
        },
    },
}
</script>

<style scoped>
div {
    font-weight: bold;
    color: #fffdd0;
}

button {
    background: #008040;
    border: none;
    color: #fffdd0;
}

h4 {
    margin: 0;
}

a {
    text-decoration: none;
}

div a {
    color: #fffdd0;
}

div a.router-link-exact-active {
    color: #fffdb0;
}

.navbar-main {
    display: flex;
    min-height: 50px;
    height: 10%;
    width: 100%;
    background: #008080;
}

.logo {
    display: flex;
    width: 60%;
    align-items: center;
    justify-content: center;
}

.side {
    display: flex;
    width: 20%;
    align-items: center;
    justify-content: center;
}
</style>

