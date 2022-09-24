function ctxReset() {
    ctx.lineWidth = 1
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'black'
}

function spawnDisk(id, color,) {
    let disk = new Disk({
        position: {
            x: 125,
            y: 300 /*-75*/
        },
        width: 150,
        height: 150,
        color: color,
        id: id
    })
    diskAssembly.red.push(disk)
}

window.addEventListener('keypress', (event) => {
    switch(event.key) {
        case '1':
            spawnDisk('red', '#DB3324')
            break;
        case 'a':
            if (diskAssembly.red.length === 0) { return }
            diskAssembly.red[0].detonate()
            break;
    }
})