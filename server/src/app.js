import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors());

import db from "./firebase.js";
import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc } from "firebase/firestore";

const port = 4000;

app.post('/addItem', async (req, res) => {
    await addDoc(collection(db, "items"), req.body.itemData);
    res.send({
        statusCode: 200
    });
});

app.post('/editItem', async (req, res) => {
    const itemRef = doc(db, "items", req.body.itemId);
    const itemData = await getDoc(itemRef);
    if (!itemData.exists()) {
        res.send({
            statusCode: 400
        });
    } else {
        res.send({
            statusCode: 200,
        });
        await setDoc(itemRef, req.body.itemData);
    }
});

app.post('/removeItem', async (req, res) => {
    const itemRef = doc(db, "items", req.body.itemId);
    const itemData = await getDoc(itemRef);
    if (!itemData.exists()) {
        res.send({
            statusCode: 400
        });
    } else {
        res.send({
            statusCode: 200,
        });
        await deleteDoc(itemRef);
    }
});

app.post('/fetchItems', async (req, res) => {
    let data = [];
    const qs = await getDocs(collection(db, "items"));
    qs.forEach(doc => {
        data.push({ id: doc.id, data: doc.data() });
    });
    res.send({
        itemData: data
    });
});

app.post('/addOrder', async (req, res) => {
    let newOrder = await addDoc(collection(db, "orders"), req.body.orderData);
    res.send({
        orderId: newOrder.id
    });
});

app.post('/removeOrder', async (req, res) => {
    const orderRef = doc(db, "orders", req.body.orderId);
    const orderData = await getDoc(orderRef);

    if (!orderData.exists()) {
        res.send({
            statusCode: 400
        });
    } else {
        res.send({
            statusCode: 200,
            itemStocks: orderData.data().items
        });
        await deleteDoc(orderRef);
    }
});

app.listen(port);
console.log(`Listening on ${port}`);
