const stringToColor = (str) => {
    if (!str?.length) return;
    // hsl max values and min values
    let [hMax, sMax, lMax] = [360, 75, 60];
    let [hMin, sMin, lMin] = [0, 50, 25];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + (hash << 5) - hash;
    }
    hash = Math.abs(hash);

    let h = Math.floor((hash % (hMax - hMin)) + hMin);
    let s = Math.floor((hash % (sMax - sMin)) + sMin);
    let l = Math.floor((hash % (lMax - lMin)) + lMin);

    // Format to css syntax
    return `hsl(${h}, ${s}%, ${l}%)`;
};

export default stringToColor;
