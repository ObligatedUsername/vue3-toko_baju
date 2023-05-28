<template>

    <div class="display-main">
        <div class="tags">
            Tags:
            <template v-for="(tag, index) in tags" :key="index">
                <span v-if="index > 0"> | </span>
                <span :class="{ selected: selectedTags[tag] }" @click="selectedTags[tag] = !selectedTags[tag]">{{ tag }}</span>
            </template>
        </div>

        <div class="items">
            <template v-for="(item, index) in taggedItems" :key="index">
                <ItemCard
                    :item="item"
                    @item-clicked="handleItemClicked"
                    @remove-item="e => $emit('removeItem', e)"
                />
            </template>
        </div>

    </div>

</template>

<script>
import ItemCard from './ItemCard.vue';

import DBService from '@/services/DBService';

export default {
    props: [ 'updateSignal', 'updatedItems', 'cartUpdate' ],

    components: {
        ItemCard
    },

    data() {
        return {
            tags: [],
            data: [],
            tempData: [],
            selectedTags: {},
        }
    },

    mounted() {
        this.load();
    },

    computed: {
        taggedItems() {
            if (!this.data.length) return;
            if (this.tags.every(tag => !this.selectedTags[tag])) return this.data;
            return this.data.filter(item => item.data.tags.some(tag => this.selectedTags[tag]));
        },
    },

    methods: {
        async load() {
            this.data = [];
            this.tags = [];
            this.selectedTags = {};

            const response = await DBService.fetchItems();
            this.data = response.data.itemData;

            if (!this.data.length) return;

            this.populate();
        },

        populate() {
            if (this.tempData.length) this.data = this.tempData;
            if (this.$route.name === 'cart') {
                let cartItem = JSON.parse(localStorage.getItem('cart')) || {};
                this.tempData = this.data;
                this.data = this.data.filter(item => {if (item.id in cartItem) return item;});
            }

            this.data.forEach(item => {
                this.tags = [ ...this.tags, ...item.data.tags ];
                this.tags = [ ...new Set(this.tags) ];
            });

            this.tags.forEach(tag => this.selectedTags[tag] = false);
        },

        handleItemClicked(e) {
            this.$emit('itemClicked', e);
        }
    },

    watch: {
        updateSignal: {
            handler() {
                this.load();
            }
        },

        cartUpdate: {
            handler() {
                this.populate();
            },
            deep: true,
            immediate: true
        },

        '$route.name': {
            handler() {
                this.populate();
            }
        },
        updatedItems: {
            handler() {
                if (this.$route.name === 'cart') {
                    Object.keys(this.updatedItems).forEach(async itemId => {
                        let itemIndex = this.tempData.findIndex(e => e.id === itemId);
                        this.updatedItems[itemId].forEach((stock, index) => {
                            this.tempData[itemIndex].data.stock[index] += stock;
                        });

                        await DBService.editItem({ itemId: itemId, itemData: this.tempData[itemIndex].data });
                    });
                }
            },
            deep: true,
        },
    },
}
</script>

<style scoped>
.display-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
}

.tags {
    width: 100%;
    height: auto;
    padding: 10px 10px 10px 10px;
}

.items {
    width: 100%;
    height: 95%;
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
}

.selected {
    color: teal;
    font-weight: bold;
}
</style>

