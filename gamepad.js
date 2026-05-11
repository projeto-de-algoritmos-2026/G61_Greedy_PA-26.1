const inputState = {};

function press(key) {
    inputState[key] = true;
    console.log(key + " pressionado");
}

function release(key) {
    inputState[key] = false;
    console.log(key + " solto");
}

document.querySelectorAll("button").forEach(button => {

    const key = button.dataset.key;

    // TOUCH
    button.addEventListener("touchstart", e => {
        e.preventDefault();
        press(key);
    });

    button.addEventListener("touchend", e => {
        e.preventDefault();
        release(key);
    });

    // MOUSE
    button.addEventListener("mousedown", () => press(key));
    button.addEventListener("mouseup", () => release(key));
});
