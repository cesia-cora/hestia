btn = document.querySelector('.showBtnEdit');
btn.style.display = 'none';

function showBtnEdit() {
    if (btn.style.display === "none") {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}