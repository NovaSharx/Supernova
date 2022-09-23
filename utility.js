function ctxReset() {
    ctx.lineWidth = 1
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'black'
}

function spawnDisk(color) {
    let disk = new Disk({
        position: {
            x: 125,
            y: -75
        },
        width: 150,
        height: 150,
        color: color
    })
    diskAssembly.red.push(disk)
}

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case '1':
            spawnDisk('red')
            break;
        case 'a':
            if (diskAssembly.red.length === 0) {return}
            if (diskAssembly.red[0].position.y + diskAssembly.red[0].height > detonatorRed.position.y &&
                diskAssembly.red[0].position.y < detonatorRed.position.y + detonatorRed.height) {
                    console.log(diskAssembly.red[0].position.y)
                    console.log(detonatorRed.position.y)
            } else {
                console.log('MISS')
            }
            break;
    }
})