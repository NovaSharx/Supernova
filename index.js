const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 720
canvas.height = 900

const refreshRate = 60

const scoreDisplay = document.getElementById('score')
const streakDisplay = document.getElementById('streak')
const streakMultiplierDisplay = document.getElementById('streakmultiplier')

const gameManager = new GameManager()

var gravity = 5 //gravity should be from 5 to 20 i.e lvl 1 to 15
var accuracyCount = 0
var accuracySum = 0
var averageAccuracy = 0

var diskAssembly = {
    red: [],
    green: [],
    blue: [],
    hitDisks: [],
    missedDisks: []
}

//red, green, blue
const triColors = ['#DB3324', '#24DB33', '#3324DB']

const gameplayDetails = {
    position: {x: null, y: 175},
    runwayWidth: 150,
    runwayHeight: 500,
    runwayOffset: 10
}

const runwayRed = new Runway({
    position: {
        x: (canvas.width/2) - (gameplayDetails.runwayWidth * 1.5) - gameplayDetails.runwayOffset,
        y: gameplayDetails.position.y
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayHeight,
    color: triColors[0]
})
const runwayGreen = new Runway({
    position: {
        x: runwayRed.position.x + gameplayDetails.runwayWidth + gameplayDetails.runwayOffset,
        y: gameplayDetails.position.y
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayHeight,
    color: triColors[1]
})
const runwayBlue = new Runway({
    position: {
        x: runwayGreen.position.x + gameplayDetails.runwayWidth + gameplayDetails.runwayOffset,
        y: gameplayDetails.position.y
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayHeight,
    color: triColors[2]
})

const detonatorRed = new Detonator({
    position: {
        x: runwayRed.position.x,
        y: runwayRed.position.y + gameplayDetails.runwayHeight
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayWidth,
    color: triColors[0]
})
const detonatorGreen = new Detonator({
    position: {
        x: runwayGreen.position.x,
        y: runwayGreen.position.y + gameplayDetails.runwayHeight
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayWidth,
    color: triColors[1]
})
const detonatorBlue = new Detonator({
    position: {
        x: runwayBlue.position.x,
        y: runwayBlue.position.y + gameplayDetails.runwayHeight
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayWidth,
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
    diskAssembly.green.forEach((disk) => {
        disk.update()
    })
    diskAssembly.blue.forEach((disk) => {
        disk.update()
    })
    diskAssembly.hitDisks.forEach((disk) => {
        disk.update()
    })
    diskAssembly.missedDisks.forEach((disk) => {
        disk.update()
    })

    renderSpawningMask()

    console.log()
}

animate()