// Heplers for redux states

export const dmExists = (value, dmIds, dms) => {
    // return true if "user.dmIds" is empty array i.e user.dmIds = [].
    if (isEmpty(dmIds)) return false;
    //search for "value" i.e. dmId in user's dmIds array if found return false.
    for (let id of dmIds) {
        if (value in dms[id]?.member) {
            console.log(value, " found in ", dms[id].member);
            return true;
        }
    }
    return false;
};

export const channelExists = (value, channelIds, channels) => {
    // false if "user.channelIds" is empty array i.e user.channelIds = [].
    if (isEmpty(channelIds)) return false;
    //compare "value" with channel's title if true return false.
    for (let id of channelIds) {
        if (value === channels[id]?.title) {
            console.log(value, " title already exists", channels[id]);
            return true;
        }
    }
    return false;
};

export const getDMName = (user, name) => {
    // returns object with name property
    const member = user?.member;
    const mIds = user?.members;
    let target = member[mIds[0]];
    target = target?.name !== name ? target : member[mIds[1]];
    return target;
};

export const makeChannelState = (id, chnl) => {
    // converts firestore channel data into state argument used by reducer
    return [
        id,
        chnl.title,
        chnl.owner,
        chnl?.msgIds,
        chnl?.members,
        chnl?.messages,
        chnl?.member,
    ];
};

export const makeDMState = (dmid, dm) => {
    // converts firestore dm data into state argument used by reducer
    const memIds = dm.members;
    const mem = dm.member;
    const a = { id: memIds[0], ...mem[memIds[0]] };
    const b = { id: memIds[1], ...mem[memIds[1]] };
    return [dmid, a, b, dm?.msgIds, dm?.messages];
};

export const makeUserState = (id, user) => {
    // converts firestore user data into state argument used by reducer
    return [id, user.name, user.avatarURL, user.channelIds, user.dmIds];
};

export const lastElement = (arr) => {
    return arr?.length ? arr[arr.length - 1] : [];
};

export const isEmpty = (array) => {
    // return true if an array is empty.
    return array?.length < 1;
};

export const arrCompare = (arr1, arr2) => {
    const equalInLength = arr1?.length === arr2?.length;
    if (equalInLength) {
        const l1 = lastElement(arr1);
        const l2 = lastElement(arr2);
        const empty = l1?.length < 1 && l2?.length < 1;
        console.log("arrCompare", arr1, arr2, empty ? true : l1 == l2);
        return empty ? true : l1 == l2;
    }
    return false;
};
