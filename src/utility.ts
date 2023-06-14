const shootingStarDisplay: HTMLElement = document.getElementById('shooting-star')!

const devModeButton: HTMLElement = document.getElementById('dev-mode')!

const mainMenuDisplay: HTMLElement = document.getElementById('main-menu-container')!
const tutorialButton: HTMLElement = document.getElementById('tutorial')!
const tutorialDisplay: HTMLElement = document.getElementById('tutorial-display')!
const tutorialImage: HTMLElement = document.getElementById('tutorial-image')!
const tutorialDescription: HTMLElement = document.getElementById('tutorial-description')!
const tutorialNextButton: HTMLElement = document.getElementById('next-tutorial')!
const tutorialPrevButton: HTMLElement = document.getElementById('prev-tutorial')!
const tutorialCloseButton: HTMLElement = document.getElementById('close-tutorial')!
const playButton: HTMLElement = document.getElementById('play-button')!
const settingsButton: HTMLElement = document.getElementById('settings')!

const inGameDisplay: HTMLElement = document.getElementById('in-game-container')!
const scoreDisplay: HTMLElement = document.getElementById('score')!
const streakDisplay: HTMLElement = document.getElementById('streak')!
const scoreMultiplierDisplay: HTMLElement = document.getElementById('scoremultiplier')!
const gravityLevelDisplay: HTMLElement = document.getElementById('gravity')!

const postGameDisplay: HTMLElement = document.getElementById('post-game-container')!
const finalScoreDisplay: HTMLElement = document.getElementById('stat-final-score')!
const highestGravityDisplay: HTMLElement = document.getElementById('stat-highest-gravity')!
const longestStreakDisplay: HTMLElement = document.getElementById('stat-longest-streak')!
const disksHitDisplay: HTMLElement = document.getElementById('stat-disks-hit')!
const averageAccuracyDisplay: HTMLElement = document.getElementById('stat-average-accuracy')!
const playAgainButton: HTMLElement = document.getElementById('play-again-button')!
const backToMenuButton: HTMLElement = document.getElementById('back-to-menu')!

const hitAudio: HTMLAudioElement = new Audio('./Assets/Audio/HitShort.wav')!
const missAudio: HTMLAudioElement = new Audio('./Assets/Audio/Miss.wav')!
const logoSwirlAudio: HTMLAudioElement = new Audio('./Assets/Audio/Logo_SwirlShort.wav')!

function renderSpawningMask() {
    ctx.fillStyle = 'black'
    ctx.fillRect(runwayRed.position.x - 3, 0, gameplayDetails.runwayWidth * 3 + gameplayDetails.runwayOffset * 3, gameplayDetails.position.y - 1)
}

function spawnDisk(id: string) {
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
    gameManager.disksSpawned++
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

    missAudio.load()
    missAudio.play()
}

function spawnShootingStar() {
    shootingStarDisplay.src = './Assets/Images/Shooting_Star_07.png'
    let position = {
        x: Math.floor(Math.random() * (window.innerWidth - 150) + 1),
        y: Math.floor(Math.random() * (window.innerHeight - 150) + 1)
    }
    setTimeout(() => {
        shootingStarDisplay.style.top = `${position.y}px`
        shootingStarDisplay.style.left = `${position.x}px`
        shootingStarDisplay.src = './Assets/Images/Shooting_Star.gif'
    }, 0)
}

// Generate a shooting star between minTIme and maxTime perpetually
function randomShootingStars() {
    let minTime = 30000
    let maxTime = 600000
    let randomTime = Math.floor((Math.random() * (maxTime - minTime + 1)) + minTime)
    setTimeout(() => {
        spawnShootingStar()
        randomShootingStars()
    }, randomTime)
}

function promptDevMode() {
    response = window.prompt('Please ENTER the Password')
    if (response === 'nova') {
        gameManager.devMode = true
        devModeButton.style.color = 'white'
        window.alert('Success!')
    } else {
        window.alert('Denied!')
    }
}

window.addEventListener('keypress', (event) => {
    if (gameManager.gameState === 'Active') {
        switch (event.key) {

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
    }

    if (gameManager.gameState === 'Active' && gameManager.devMode) {
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

        }
    }

    switch (event.key) {
        case 'e':
            spawnShootingStar()
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

devModeButton.addEventListener('click', () => {
    if (!gameManager.devMode) {
        promptDevMode()
    } else {
        gameManager.devMode = false
        devModeButton.style.color = 'rgb(129, 129, 129)'
    }
})

tutorialButton.addEventListener('click', () => {
    tutorialDisplay.style.display = 'flex'
    gameManager.gameState = 'Menu-Tutorial'
    gameManager.tutorialSlide = 0
    tutorialImage.src = `./Assets/Images/tutorial_slide_${gameManager.tutorialSlide}.jpg`
    tutorialDescription.innerHTML = gameManager.tutorialDescriptions[gameManager.tutorialSlide]
})

tutorialNextButton.addEventListener('click', () => {
    gameManager.tutorialSlide++
    if (gameManager.tutorialSlide > 8) {
        gameManager.tutorialSlide = 0
    }
    tutorialImage.src = `./Assets/Images/tutorial_slide_${gameManager.tutorialSlide}.jpg`
    tutorialDescription.innerHTML = gameManager.tutorialDescriptions[gameManager.tutorialSlide]
})

tutorialPrevButton.addEventListener('click', () => {
    gameManager.tutorialSlide--
    if (gameManager.tutorialSlide < 0) {
        gameManager.tutorialSlide = 8
    }
    tutorialImage.src = `./Assets/Images/tutorial_slide_${gameManager.tutorialSlide}.jpg`
    tutorialDescription.innerHTML = gameManager.tutorialDescriptions[gameManager.tutorialSlide]
})

tutorialCloseButton.addEventListener('click', () => {
    tutorialDisplay.style.display = 'none'
    gameManager.gameState = 'Main-Menu'
})

playButton.addEventListener('click', () => {
    gameManager.startGame()
})

playAgainButton.addEventListener('click', () => {
    gameManager.startGame()
})

backToMenuButton.addEventListener('click', () => {
    gameManager.loadMainMenu()
})