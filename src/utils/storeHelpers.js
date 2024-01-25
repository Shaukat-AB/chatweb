// Helpers that import from firestore,

import {
    collection,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
    getDocs,
    where,
    documentId,
    query,
} from "firebase/firestore";
import { db } from "../firebase";


export const getDocuments = async (col, ids) => {
    if(ids.length < 1) return null;
    const q = query(collection(db, col), where(documentId(),'in', ids));
    const obj = {};
    let i = 0;
    try {
        const docSnap = await getDocs(q);
        docSnap.forEach((doc) => {
            const data = doc.data();
            obj[ids[i]] = data;
            i += 1;
        });
        console.log("get ", col," documents: ", obj);
        return obj;
    }catch(e){
        console.error(col," getdocs failed", e);
        return null;
    }
}

export const checkUserId = async (uid) => {
    let res = null;
    try{
        res = await getDocument(createDocRef("User", uid));
    }catch(e){
        console.error(uid, " failed", e);
    }
    return res;
};

export const checkChannelId = async (id) => {
    let res = null;
    try{
        res = await getDocument(createDocRef("Channel", id));
    }catch(e){
        console.error(id, "failed", e);
    }
    return res;
};

export const checkDMId = async (id) => {
    let res = null;
    try{
        res = await getDocument(createDocRef("DM", id));
    }catch(e){
        console.error(id, " failed", e);
    }
    return res;
};

export const AddOrSetDM = async (id, dm) => {
    if (!id || !dm) return;
    const DM = { ...dm, lastUpdated: serverTimestamp() };
    await AddOrSetDoc("DM", id, DM);
};

export const AddOrSetChannel = async (id, channel) => {
    if (!id || !channel) return;
    const chnl = { ...channel, lastUpdated: serverTimestamp() };
    await AddOrSetDoc("Channel", id, chnl);
};

export const AddOrSetUser = async (user) => {
    console.log(user);
    if (!user?.id) return;
    const userObj = Object.create(null);
    userObj["lastUpdated"] = serverTimestamp();
    Object.keys(user).forEach(
        (key) => key != "id" && (userObj[key] = user[key])
    );
    await AddOrSetDoc("User", user.id, userObj);
};

export const getDocument = async (docRef) => {
    const docSnap = await getDoc(docRef);
    let res = null;
    if (docSnap.exists()) {
        console.log(docRef.id, " Document data:", docSnap.data());
        res = docSnap.data();
    } else {
        console.log(docRef.id, " No such document!");
    }
    return res;
};

export const updateDocument = async (docRef, value) => {
    try {
        await updateDoc(docRef, value);
        console.log(" : Document updated with ID: ", docRef.id);
    } catch (e) {
        console.error("Error udating document: ", e);
    }
};

export const AddOrSetDoc = async (collection, docId, value) => {
    // If the document does not exist, it will be created. If the document does exist, its contents will be merged into the existing document.
    try {
        const docRef = createDocRef(collection, docId);
        await setDoc(docRef, value, { merge: true });
        console.log(collection + " : Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const createDocRef = (collection, docId) => {
    return doc(db, collection, docId);
};
