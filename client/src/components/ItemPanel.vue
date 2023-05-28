<template>

    <div class="panel-main">

        <div class="addItem" v-if="$route.params.item === 'add-item'">
            
            <form id="addForm" @submit.prevent="addItem"></form>

            Name:
            <h3>
                <input type="text" form="addForm" v-model="newItem.name" :placeHolder="newItem.name">
            </h3>

            Description:
            <h4>
                <input type="text" form="addForm" v-model="newItem.description" :placeHolder="newItem.description">
            </h4>

            Image Name: <input type="text" form="addForm" v-model="newItem.imgName" :placeholder="newItem.imgName">
            
            Price: <input type="number" form="addForm" v-model="newItem.price" :placeHolder="newItem.price"><br><br>

            Stock for each available sizes:<br>
            <template v-for="(size, index) in newItem.sizes" :key="index">
                Size {{ size }}:
                    <input type="number" form="addForm" v-model="newItem.stock[index]" :placeHolder="newItem.stock[index]">
                <br>
            </template><br>

            Weight (in grams): <input type="text" form="addForm" v-model="newItem.weight" :placeholder="newItem.weight"><br>

            Tags:<br>
            <form @submit.prevent="() => { newItem.tags = [ ...newItem.tags, tempTag ]; tempTag = '' }">
                <input type="text" v-model="tempTag">
                <input type="submit" value="Add Tag" :disabled="!tempTag.length">
            </form>

            <template v-for="(tag, index) in newItem.tags" :key="index">
                <span v-if="index > 0"> | </span>
                <span @click="newItem.tags.splice(newItem.tags.indexOf(tag), 1)">{{ tag }}</span>
            </template><br>

            <input type="submit" form="addForm" value="Add Item" :disabled="Object.keys(newItem).length < 6">

        </div>
    
        <div class="removeOrder" v-if="$route.params.item === 'remove-order'">
            Please enter your order ID here:
            <form @submit.prevent="removeOrder">
                <input type="text" v-model="orderID" placeholder="Enter your order ID here..."><br>
                <input type="submit" value="Remove" :disabled="!orderID.length">
                <span v-if="statusCode == 400">This order ID is invalid. Please recheck your order ID and try again.</span>
                <span v-if="statusCode == 200">The order has been removed.</span>
            </form>

        </div>

        <div class="itemDetail" v-if="Object.keys(item).length && $route.params.item === '0'">

            <form v-if="editMode" id="editForm"></form>

            <h3>
                <input type="text" form="editForm" v-model="item.data.name" :placeHolder="item.data.name" v-if="editMode">
                <span v-else>{{ item.data.name }}</span>
            </h3>

            <h4>
                <input type="text" form="editForm" v-model="item.data.description" :placeHolder="item.data.description" v-if="editMode">
                <span v-else>{{ item.data.description }}</span>
            </h4>

            <span v-if="editMode"> Image Name: <input type="text" form="editForm" v-model="item.data.imgName" :placeholder="item.data.imgName"><br></span>
            
            Sold @
                <input type="number" form="editForm" v-model="item.data.price" :placeHolder="item.data.price" v-if="editMode">
                <span v-else>{{ item.data.price }}</span>
            per piece<br><br>

            Stock for each available sizes:<br>
            <template v-for="(size, index) in item.data.sizes" :key="index">
                <span v-if="cart[item.id] !== undefined && cart[item.id][size] && $route.name !== 'dashboard-admin'" >(Ordered: {{ cart[item.id][size] }})</span>
                Size {{ size }}:
                    <input type="number" form="editForm" v-model="item.data.stock[index]" :placeHolder="item.data.stock[index]" v-if="editMode">
                    <span v-else>{{ item.data.stock[index] }}</span>

                <template v-if="$route.name !== 'dashboard-admin'">
                     | 
                    <button @click="addToCart(size)">+</button>
                    <button @click="rmFromCart(size)">-</button>
                </template>
                <br>
            </template><br>

            Weight (in grams):
                <input type="text" form="editForm" v-model="item.data.weight" :placeholder="item.data.weight" v-if="editMode">
                <span v-else>{{ item.data.weight }}</span><br>

            Tags:<br>
            <form @submit.prevent="() => { item.data.tags = [ ...item.data.tags, tempTag ]; tempTag = '' }" v-if="editMode">
                <input type="text" v-model="tempTag">
                <input type="submit" value="Add Tag" :disabled="!tempTag.length">
            </form>

            <template v-for="(tag, index) in item.data.tags" :key="index">
                <span v-if="index > 0"> | </span>
                <span @click="() => { if (editMode) item.data.tags.splice(item.data.tags.indexOf(tag), 1) }">{{ tag }}</span>
            </template>

            <template v-if="$route.name === 'dashboard-admin'">
                <button class="editBtn" @click="editMode = !editMode">Edit</button>
            </template>

        </div>
        
    </div>

</template>

<script>
import DBService from '@/services/DBService';

export default {
    props: [ 'itemClicked' ],
data() {
        return {
            orderID: "",
            cart: {},
            item: {},
            statusCode: 0,
            editMode: false,
            tempTag: "",
            newItem: { stock: [], tags: [], sizes: ['S', 'M', 'L'] }
        }
    },

    created() {
        if (localStorage.getItem('cart')) this.cart = JSON.parse(localStorage.getItem('cart'));
    },

    methods: {
        async removeOrder() {
            const response = await DBService.removeOrder({ orderId: this.orderID });
            this.orderID = "";
            this.statusCode = response.data.statusCode;
            setTimeout(() => this.statusCode = 0, 2000);

            if (this.statusCode === 400) return;

            this.$emit('itemUpdate', response.data.itemStocks);
        },

        async addItem() {
            this.newItem.imgName += (this.newItem.imgName.endsWith('.png')) ? '' : '.png';

            await DBService.addItem({ itemData: this.newItem });

            this.newItem = { stock: [], tags: [], sizes: ['S', 'M', 'L'] };
            this.$emit('updateItems');
        },

        async editItem() {
            await DBService.editItem({ itemId: this.item.id, itemData: this.item.data });

            this.$emit('updateItems');
        },

        addToCart(size) {
            if (this.cart[this.item.id] === undefined) this.cart[this.item.id] = {};
            if (this.cart[this.item.id][size] === undefined) this.cart[this.item.id][size] = 1;
            else if (this.cart[this.item.id][size] < this.item.data.stock[this.item.data.sizes.indexOf(size)]) this.cart[this.item.id][size]++;
        },

        rmFromCart(size) {
            if (this.cart[this.item.id] === undefined || this.cart[this.item.id][size] === undefined) return;
            if (this.cart[this.item.id][size] > 0) this.cart[this.item.id][size]--;
            if (this.cart[this.item.id][size] == 0) delete this.cart[this.item.id][size];
            if (!Object.keys(this.cart[this.item.id]).length) delete this.cart[this.item.id];
        },
    },

    watch: {
        cart: {
            handler() {
                if(!this.cart[this.item.id] && this.$route.name === 'cart') this.item = {};

                localStorage.setItem('cart', JSON.stringify(this.cart));
                this.$emit('cartUpdate', { type: 'content-available', value: this.cart[this.item.id] });
                this.$emit('cartUpdate', { type: 'count', value: Object.keys(this.cart).length });
            },
            deep: true
        },

        itemClicked: {
            handler() {
                this.item = this.itemClicked;
            },
            deep: true,
            immediate: true
        },

        '$route.name': {
            handler() {
                this.editMode = false;
            }
        },

        '$route.params.item': {
            handler() {
                this.tempTag = "";
            },
            deep: true
        },

        editMode: {
            handler(newVal) {
                if (!newVal) this.editItem();
            }
        },
    },
}
</script>

<style scoped>
button {
    background: #008040;
    border: none;
    color: #fffdd0;
}

input[type=text] {
    width: 100%;
}

input[type=number] {
    width: 100%;
}

.panel-main {
    height: calc(100% - 2 * 13px);
    background: darkcyan;
    color: #fffdd0;
    margin: 5px;
    padding: 8px;
    text-align: right;
}

.editBtn {
    width: 100%;
    margin-top: 10px;
}
</style>

