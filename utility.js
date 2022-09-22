function ctxReset() {
    ctx.lineWidth = 1
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'black'
}

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'f':
            console.log(event.key)
            
            break;
    }
})