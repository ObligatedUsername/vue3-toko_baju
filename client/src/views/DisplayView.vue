<template>
    <NavBar
        :cart-count="cartCount"
        :items-to-remove="itemsToRemove"
        @update-items="() => updateSignal = !updateSignal"
    />

    <div class="main" :style="{ gridTemplateColumns: Object.keys(itemClicked).length || !($route.params.item === '0' || $route.params.item === 'remove-items') ? '80% 20%' : 'none' }">

        <div class="display">
            <ItemDisplay
                :updated-items="updatedItems"
                :update-items="updateSignal"
                :cart-update="contentAvail"
                @item-clicked="e => itemClicked = (itemClicked.id === e.id) ? {} : e"
                @remove-item="e => { if (itemsToRemove.includes(e)) { itemsToRemove.splice(itemsToRemove.indexOf(e), 1); } else { itemsToRemove.push(e); }}"
            />
        </div>

        <div class="panel" v-if="Object.keys(itemClicked).length || !($route.params.item === '0' || $route.params.item === 'remove-items')">
            <ItemPanel
                @cart-update="handleCartUpdate"
                @item-update="e => updatedItems = e"
                @update-items="() => updateSignal = !updateSignal"
                :item-clicked="itemClicked"
            />

        </div>

    </div>

</template>

<script>
import ItemDisplay from '../components/ItemDisplay.vue';
import ItemPanel from '../components/ItemPanel.vue';
import NavBar from '../components/NavBar.vue';

export default {
    components: {
        ItemDisplay,
        ItemPanel,
        NavBar,
    },

    data() {
        return {
            cartCount: 0,
            updatedItems: {},
            itemClicked: {},
            contentAvail: false,
            updateSignal: false,
            itemsToRemove: [],
        }
    },

    methods: {
        handleCartUpdate(e) {
            if (e.type === 'count') this.cartCount = e.value;
            else if (e.type === 'content-available') {
                this.contentAvail = e.value;
                if (!this.contentAvail && this.$route.name === 'cart') this.itemClicked = {};
            }
        },
    },

    watch: {
        '$route.params.item': {
            handler(_, oldVal) {
                if (oldVal === '0') this.itemClicked = {};
            },
            deep: true,
            immediate: true
        },
    },
}
</script>

<style scoped>
.main {
    display: grid;
    height: 90%;
}

.display {
    grid-column: 1;
}

.panel {
    grid-column: 2;
}
</style>
