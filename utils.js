module.exports = {
    logMessage(message) {
        const date = new Date();
        const d = date.toDateString();
        const t = date.toLocaleTimeString();
    
        console.log('[' + d + ' ' + t + '] ' + message);
    },
    dateString() {
        var date = new Date();
        var d = date.toDateString();
        var t = date.toLocaleTimeString();
    
        return '[' + d + ' ' + t + '] ';
    }

};
