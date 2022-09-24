function spawnDisk(id, color,) {
    let disk = new Disk({
        position: {
            x: 125,
            y: -75
        },
        width: 150,
        height: 150,
        color: color,
        id: id
    })
    diskAssembly.red.push(disk)
}

function diskMissed() {
    console.log('MISS!')
}

window.addEventListener('keypress', (event) => {
    switch (event.key) {
        case '1':
            spawnDisk('red', '#DB3324')
            break;
        case '4':
            setInterval(() => {
                spawnDisk('red', '#DB3324')
            }, 4000/gravity);
            break;
        case 'a':
            if (diskAssembly.red.length === 0) {
                diskMissed()
                return
            }
            diskAssembly.red[0].detonate()
            break;
    }
})