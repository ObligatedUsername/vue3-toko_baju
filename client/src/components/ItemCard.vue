<template>

    <div class="card-main" :class="{ rmSelect: removalSelect }" @click="handleClick">
        
        <div class="image">
            {{ item.data.imgName }}
        </div>

        <div class="name">
            {{ item.data.name }}
        </div>

    </div>

</template>

<script>
export default {
    props: [ 'item' ],

    data() {
        return {
            removalSelect: false,
        }
    },

    methods: {
        handleClick() {
            if (this.$route.params.item === 'remove-items') {
                this.removalSelect = !this.removalSelect;
                this.$emit('removeItem', this.item.id);
            } else {
                this.$emit('itemClicked', this.item);
                this.$router.push('/' + this.$route.name + '/0');
            }
        },
    },
}
</script>

<style scoped>
.card-main{
    display: flex;
    flex-wrap: wrap;
    height: 200px;
    width: 200px;
    border: 5px solid teal;
    margin: auto;
}

.image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80%;
    width: 100%;
    border-bottom: 2px dashed green;
}

.name {
    display: flex;
    align-items: center;
    justify-content: center;
    color: teal;
    font-weight: bold;
    z-index: -1;
    height: 20%;
    width: 100%;
}

.rmSelect {
    border-color: #C93F0F;
}
</style>

