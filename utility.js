const mainMenuDisplay = document.getElementById('main-menu-container')
const playGameButton = document.getElementById('play-game')

const inGameDisplay = document.getElementById('in-game-container')
const scoreDisplay = document.getElementById('score')
const streakDisplay = document.getElementById('streak')
const scoreMultiplierDisplay = document.getElementById('scoremultiplier')
const gravityLevelDisplay = document.getElementById('gravity')

const postGameDisplay = document.getElementById('post-game-container')
const finalScoreDisplay = document.getElementById('stat-final-score')
const highestGravityDisplay = document.getElementById('stat-highest-gravity')
const longestStreakDisplay = document.getElementById('stat-longest-streak')
const averageAccuracyDisplay = document.getElementById('stat-average-accuracy')
const playAgainButton = document.getElementById('play-again-button')
const backToMenuButton = document.getElementById('back-to-menu')

function renderSpawningMask() {
    ctx.fillStyle = 'black'
    ctx.fillRect(runwayRed.position.x - 3, 0, gameplayDetails.runwayWidth * 3 + gameplayDetails.runwayOffset * 3, gameplayDetails.position.y - 1)
}

function spawnDisk(id) {
    let columnPosX
    let runwayBonusState = false

    switch (id) {
        case 'red':
            columnPosX = runwayRed.position.x
            if (runwayRed.bonusState) {
                runwayBonusState = true
            }
            break;
        case 'green':
            columnPosX = runwayGreen.position.x
            if (runwayGreen.bonusState) {
                runwayBonusState = true
            }
            break;
        case 'blue':
            columnPosX = runwayBlue.position.x
            if (runwayBlue.bonusState) {
                runwayBonusState = true
            }
            break;
    }

    let disk = new Disk({
        position: {
            x: columnPosX,
            y: gameplayDetails.position.y - 150
        },
        imageSrc: `./Assets/Images/Disk_${id}.png`,
        bonusState: runwayBonusState,
        id: id
    })

    if (disk.bonusState) {
        disk.image.src = `./Assets/Images/Disk_Bonus_${id}.png`
    }

    switch (id) {
        case 'red':
            diskAssembly.red.push(disk)
            break;
        case 'green':
            diskAssembly.green.push(disk)
            break;
        case 'blue':
            diskAssembly.blue.push(disk)
            break;
    }
}

function runwayDiskSpawner(id) {
    setTimeout(() => {
        spawnDisk(id)
        runwayDiskSpawner(id)
    }, 4000 / gameManager.gravity);
}

function randomDiskSpawner() {
    gameManager.diskSpawnerId = setTimeout(() => {
        let random = Math.floor(Math.random() * 3)
        let id
        switch (random) {
            case 0:
                id = 'red'
                break;
            case 1:
                id = 'green'
                break;
            case 2:
                id = 'blue'
                break;
        }
        spawnDisk(id)
        randomDiskSpawner()
    }, 4000 / gameManager.gravity)
}

function diskMissed(id) {
    switch (id) {
        case 'red':
            detonatorRed.image.src = './Assets/Images/Detonator_Miss_red.png'
            break;
        case 'green':
            detonatorGreen.image.src = './Assets/Images/Detonator_Miss_green.png'
            break;
        case 'blue':
            detonatorBlue.image.src = './Assets/Images/Detonator_Miss_blue.png'
            break;
    }

    gameManager.updateSkillRating('lose')
    gameManager.updateStreak('miss')
}

window.addEventListener('keypress', (event) => {
    // if (gameManager.gameState != 'Active') { return }

    switch (event.key) {

        // Game Dev buttons
        case '1':
            spawnDisk('red')
            break;
        case '2':
            spawnDisk('green')
            break;
        case '3':
            spawnDisk('blue')
            break;
        case '4':
            runwayDiskSpawner('red')
            break;
        case '5':
            runwayDiskSpawner('green')
            break;
        case '6':
            runwayDiskSpawner('blue')
            break;
        case '0':
            randomDiskSpawner()
            break;
        case ' ':
            gameManager.startGame()
            break;

        // Regular Game Buttons
        case 'a':
            if (diskAssembly.red.length === 0) {
                diskMissed('red')
            } else {
                diskAssembly.red[0].detonate()
            }
            break;
        case 's':
            if (diskAssembly.green.length === 0) {
                diskMissed('green')
            } else {
                diskAssembly.green[0].detonate()
            }
            break;
        case 'd':
            if (diskAssembly.blue.length === 0) {
                diskMissed('blue')
            } else {
                diskAssembly.blue[0].detonate()
            }
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            detonatorRed.image.src = './Assets/Images/Detonator_red.png'
            break;
        case 's':
            detonatorGreen.image.src = './Assets/Images/Detonator_green.png'
            break;
        case 'd':
            detonatorBlue.image.src = './Assets/Images/Detonator_blue.png'
            break;
    }
})

playGameButton.addEventListener('click', ()=> {
    gameManager.startGame()
})

playAgainButton.addEventListener('click', ()=> {
    gameManager.startGame()
})

backToMenuButton.addEventListener('click', ()=> {
    gameManager.loadMainMenu()
})