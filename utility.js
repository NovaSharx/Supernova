function ctxReset() {
    ctx.lineWidth = 1
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'black'
}

function spawnDisk(color) {
    let disk = new Disk({
        position: {
            x: 125,
            y: 500/*-75*/
        },
        width: 150,
        height: 150,
        color: color
    })
    diskAssembly.red.push(disk)
}

window.addEventListener('keypress', (event) => {
    switch(event.key) {
        case '1':
            spawnDisk('#DB3324')
            break;
        case 'a':
            diskAssembly.red[0].detonate()
            break;
    }
})