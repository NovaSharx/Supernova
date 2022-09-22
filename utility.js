function ctxReset() {
    ctx.lineWidth = 1
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'black'
}

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'f':
            console.log(event.key)
            let disk = new Disk({
                position: {
                    x: 125,
                    y: 100
                },
                width: 150,
                height: 150,
                color: 'red'
            })
            diskAssembly.push(disk)
            break;
    }
})