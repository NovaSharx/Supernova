const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 900
canvas.height = 900

const refreshRate = 60 // fps

const scoreDisplay = document.getElementById('score')
const streakDisplay = document.getElementById('streak')
const scoreMultiplierDisplay = document.getElementById('scoremultiplier')
const gravityLevelDisplay = document.getElementById('gravity')
const postGameDisplay = document.getElementById('post-game')

const gameManager = new GameManager()
const gameTimer = new Timer()

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
    position: {x: null, y: 150},
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
        y: runwayRed.position.y + gameplayDetails.runwayHeight + gameplayDetails.runwayOffset
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayWidth,
    color: triColors[0],
    imageSrc: './Assets/Images/Detonator_red.png'
})
const detonatorGreen = new Detonator({
    position: {
        x: runwayGreen.position.x,
        y: runwayGreen.position.y + gameplayDetails.runwayHeight + gameplayDetails.runwayOffset
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayWidth,
    color: triColors[1],
    imageSrc: './Assets/Images/Detonator_green.png'
})
const detonatorBlue = new Detonator({
    position: {
        x: runwayBlue.position.x,
        y: runwayBlue.position.y + gameplayDetails.runwayHeight + gameplayDetails.runwayOffset
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayWidth,
    color: triColors[2],
    imageSrc: './Assets/Images/Detonator_blue.png'
})

function animate() {
    setTimeout(function () { window.requestAnimationFrame(animate) }, 1000 / refreshRate)

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    runwayRed.update()
    runwayGreen.update()
    runwayBlue.update()

    detonatorRed.update()
    detonatorGreen.update()
    detonatorBlue.update()

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

    gameTimer.render()
}

animate()