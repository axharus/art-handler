console.log('debuger loaded !');
window.onerror = () => {
    console.log('found it!!!!!!!!!!!!!!');
}
window.addEventListener('error', function(e) {
    console.log('found it!!!!!!!!!!!!!!',e);
}, true);

console.error = () => {
    console.log('found it!!!!!!!!!!!!!!');
}
