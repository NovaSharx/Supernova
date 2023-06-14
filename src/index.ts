const canvas: HTMLCanvasElement = document.querySelector('canvas')!
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

canvas.width = 900
canvas.height = 900

const refreshRate: number = 60 // fps

const gameManager: GameManager = new GameManager()
const gameTimer: Timer = new Timer()

var diskAssembly: DiskAssembly = {
    red: [],
    green: [],
    blue: [],
    hitDisks: [],
    missedDisks: []
}

//red, green, blue
const triColors: string[] = ['#DB3324', '#24DB33', '#3324DB']

const gameplayDetails = {
    position: { x: null, y: 150 },
    runwayWidth: 150,
    runwayHeight: 500,
    runwayOffset: 10
}

const runwayRed: Runway = new Runway({
    position: {
        x: (canvas.width / 2) - (gameplayDetails.runwayWidth * 1.5) - gameplayDetails.runwayOffset,
        y: gameplayDetails.position.y
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayHeight,
    color: triColors[0]
})
const runwayGreen: Runway = new Runway({
    position: {
        x: runwayRed.position.x + gameplayDetails.runwayWidth + gameplayDetails.runwayOffset,
        y: gameplayDetails.position.y
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayHeight,
    color: triColors[1]
})
const runwayBlue: Runway = new Runway({
    position: {
        x: runwayGreen.position.x + gameplayDetails.runwayWidth + gameplayDetails.runwayOffset,
        y: gameplayDetails.position.y
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayHeight,
    color: triColors[2]
})

const detonatorRed: Detonator = new Detonator({
    position: {
        x: runwayRed.position.x,
        y: runwayRed.position.y + gameplayDetails.runwayHeight + gameplayDetails.runwayOffset
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayWidth,
    color: triColors[0],
    imageSrc: './Assets/Images/Detonator_red.png'
})
const detonatorGreen: Detonator = new Detonator({
    position: {
        x: runwayGreen.position.x,
        y: runwayGreen.position.y + gameplayDetails.runwayHeight + gameplayDetails.runwayOffset
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayWidth,
    color: triColors[1],
    imageSrc: './Assets/Images/Detonator_green.png'
})
const detonatorBlue: Detonator = new Detonator({
    position: {
        x: runwayBlue.position.x,
        y: runwayBlue.position.y + gameplayDetails.runwayHeight + gameplayDetails.runwayOffset
    },
    width: gameplayDetails.runwayWidth,
    height: gameplayDetails.runwayWidth,
    color: triColors[2],
    imageSrc: './Assets/Images/Detonator_blue.png'
})

function animate(): void {
    setTimeout((): void => { window.requestAnimationFrame(animate) }, 1000 / refreshRate)

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    runwayRed.update()
    runwayGreen.update()
    runwayBlue.update()

    detonatorRed.update()
    detonatorGreen.update()
    detonatorBlue.update()

    diskAssembly.red.forEach((disk: Disk):void => {
        disk.update()
    })
    diskAssembly.green.forEach((disk: Disk):void => {
        disk.update()
    })
    diskAssembly.blue.forEach((disk: Disk):void => {
        disk.update()
    })
    diskAssembly.hitDisks.forEach((disk: Disk):void => {
        disk.update()
    })
    diskAssembly.missedDisks.forEach((disk: Disk):void => {
        disk.update()
    })

    renderSpawningMask()

    gameTimer.render()
}

animate() // Render game

randomShootingStars() // Animate shooting stars