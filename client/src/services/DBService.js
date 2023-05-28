import Api from './Api.js';

export default {
    addItem(credentials) {
        return Api().post('addItem', credentials);
    },

    editItem(credentials) {
        return Api().post('editItem', credentials);
    },

    removeItem(credentials) {
        return Api().post('removeItem', credentials);
    },

    fetchItems(credentials) {
        return Api().post('fetchItems', credentials);
    },

    addOrder(credentials) {
        return Api().post('addOrder', credentials);
    },

    removeOrder(credentials) {
        return Api().post('removeOrder', credentials);
    }
}
