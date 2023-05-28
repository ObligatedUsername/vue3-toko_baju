<template>

    <NavBar />

    <div class="main">

        <h1>This is a checkout page</h1>

        <form @submit.prevent="makeOrder">
            Name: <input type="text" placeholder="Enter your name here..." v-model="orderInfo.name"><br>
            Phone Number: <input type="text" placeholder="Enter your phone number here..." v-model="orderInfo.phone_num"><br>
            Home Address: <input type="text" placeholder="Enter your home address here..." v-model="orderInfo.address"><br>
            Courier:
                <input type="radio" value="JNE" v-model="orderInfo.courier">JNE
                <input type="radio" value="Tiki" v-model="orderInfo.courier">Tiki
                <input type="radio" value="SiCepat" v-model="orderInfo.courier">SiCepat
                <input type="radio" value="GoSend" v-model="orderInfo.courier" selected>GoSend

            <br><br>
            <input type="submit" value="Send Order" :disabled="Object.keys(orderInfo).length < 4">
        </form>

        <h1 v-if="orderID.length">Your order ID: {{ orderID }}</h1>

    </div>

</template>

<script>
import DBService from '@/services/DBService';

import NavBar from '../components/NavBar.vue';

export default {
    components: {
        NavBar,
    },

    data() {
        return {
            orderInfo: {},
            orderID: "",
        }
    },

    methods: {
        async makeOrder() {
            this.orderInfo.items = JSON.parse(localStorage.getItem('cart')) || {};
            const currData = await DBService.fetchItems();

            currData.data.itemData.forEach(async (data, index) => {
                if (Object.keys(this.orderInfo.items).includes(data.id)) {
                    Object.values(this.orderInfo.items[data.id]).forEach((stock, stockInd) => {
                        currData.data.itemData[index].data.stock[stockInd] -= stock;
                    });
                }

                await DBService.editItem({ itemId: currData.data.itemData[index].id, itemData: currData.data.itemData[index].data });
            });

            Object.entries(this.orderInfo.items).forEach(item => {
                this.orderInfo.items[item[0]] = Object.values(item[1]);
            });

            const res = await DBService.addOrder({ orderData: this.orderInfo });

            this.orderID = res.data.orderId;
            setTimeout(() => this.orderID = "", 10000);
            this.orderInfo = {};
        },
    },

    watch: {
        '$route.name': {
            handler() {
                this.orderID = "";
            }
        },
    }
}
</script>

<style scoped>
.main {
    width: 100%;
    height: 100%;
    text-align: center;
}
</style>
