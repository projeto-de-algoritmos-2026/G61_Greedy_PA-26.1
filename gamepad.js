export const inputState = {};

export function press(key) {
    inputState[key] = true;
    console.log(key + " pressionado");
}

export function release(key) {
    inputState[key] = false;
    console.log(key + " solto");
}

export function initInputButtons() {
    document.querySelectorAll("button").forEach(button => {
        const key = button.dataset.key;
        
        if (!key) return;

        button.addEventListener("touchstart", e => {
            e.preventDefault();
            press(key);
        });

        button.addEventListener("touchend", e => {
            e.preventDefault();
            release(key);
        });

        button.addEventListener("mousedown", () => press(key));
        button.addEventListener("mouseup", () => release(key));
    });
}