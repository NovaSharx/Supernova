const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 720
canvas.height = 840

var gravity = 1

const triColors = ['#DB3324', '#24DB33', '#3324DB']

const runwayRed = new Runway({
    position: {x: 200, y: 100},
    width: 100,
    height: 500,
    color: triColors[0]
})
const runwayGreen = new Runway({
    position: {x: 310, y: 100},
    width: 100,
    height: 500,
    color: triColors[1]
})
const runwayBlue = new Runway({
    position: {x: 420, y: 100},
    width: 100,
    height: 500,
    color: triColors[2]
})

const detonatorRed = new Detonator ({
    position: {
        x: runwayRed.position.x,
        y: runwayRed.position.y + 510
    },
    color: triColors[0]
})
const detonatorGreen = new Detonator ({
    position: {
        x: runwayGreen.position.x,
        y: runwayGreen.position.y + 510
    },
    color: triColors[1]
})
const detonatorBlue = new Detonator ({
    position: {
        x: runwayBlue.position.x,
        y: runwayBlue.position.y + 510
    },
    color: triColors[2]
})

function animate() {
    window.requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,canvas.width,canvas.height)

    console.log(gravity)

    runwayRed.update()
    runwayGreen.update()
    runwayBlue.update()

    detonatorRed.render()
    detonatorGreen.render()
    detonatorBlue.render()
}

animate()