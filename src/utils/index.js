function addStyle(css) {
    try {
        var style = document.createElement("style");
        style.textContent = css;
        (
            document.head ||
            document.body ||
            document.documentElement ||
            document
        ).appendChild(style);
    } catch (e) {
        console.log("Error: env: adding style " + e);
    }
}


module.exports = {
    addStyle
} 