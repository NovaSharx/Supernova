const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 720
// canvas.height = 840
canvas.height = 1000

const refreshRate = 60
var gravity = 3

var diskAssembly = {
    red: [],
    green: [],
    blue: []
}

var hitDisks = []
var missedDisks = []

const triColors = ['#DB3324', '#24DB33', '#3324DB'] //red, green, blue

const runwayRed = new Runway({
    position: { x: 125, y: 100 },
    width: 150,
    height: 550,
    color: triColors[0]
})
const runwayGreen = new Runway({
    position: { x: 285, y: 100 },
    width: 150, 
    height: 550,
    color: triColors[1]
})
const runwayBlue = new Runway({
    position: { x: 445, y: 100 },
    width: 150,
    height: 550,
    color: triColors[2]
})

const detonatorRed = new Detonator({
    position: {
        x: runwayRed.position.x,
        y: runwayRed.position.y + 560
    },
    width: runwayRed.width,
    height: runwayRed.width,
    color: triColors[0]
})
const detonatorGreen = new Detonator({
    position: {
        x: runwayGreen.position.x,
        y: runwayGreen.position.y + 560
    },
    width: runwayGreen.width,
    height: runwayGreen.width,
    color: triColors[1]
})
const detonatorBlue = new Detonator({
    position: {
        x: runwayBlue.position.x,
        y: runwayBlue.position.y + 560
    },
    width: runwayBlue.width,
    height: runwayBlue.width,
    color: triColors[2]
})

function animate() {
    setTimeout(function () { window.requestAnimationFrame(animate) }, 1000 / refreshRate) //60 fps

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    runwayRed.render()
    runwayGreen.render()
    runwayBlue.render()

    detonatorRed.render()
    detonatorGreen.render()
    detonatorBlue.render()

    diskAssembly.red.forEach((disk) => {
        disk.update()
    })

    hitDisks.forEach((disk) => {
        disk.update()
    })

    missedDisks.forEach((disk) => {
        disk.update()
    })

}

animate()

// setInterval(() => {
//     spawnDisk('red', '#DB3324')
// }, 1500);