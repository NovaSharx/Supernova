interface DiskAssembly {
    red: Disk[],
    green: Disk[],
    blue: Disk[],
    hitDisks: Disk[],
    missedDisks: Disk[]
}

interface position {
    x: number,
    y: number
}

interface SpriteProperties {
    position: position,
    width: number,
    height: number,
    imageSrc?: string,
}

interface ColoredSpriteProperties extends SpriteProperties {
    color: string
}

interface DiskSpriteProperties extends SpriteProperties {
    id: string,
    bonusState: boolean,
}

class Sprite {

    position: position
    width: number
    height: number
    image: HTMLImageElement

    constructor({
        position,
        width,
        height,
        imageSrc = '',
    }: SpriteProperties) {
        this.position = position
        this.width = width
        this.height = height
        this.image = new Image()
        this.image.src = imageSrc
    }

    draw(): void {
        //image to be drawn
        ctx.drawImage(
            this.image,
            //coordinates to drawn
            this.position.x, this.position.y,
            //width and height
            this.width, this.height
        )
    }
}

class Runway extends Sprite {

    color: string
    strokeStrength: number
    powerBar: number
    bonusState: boolean
    bonusDurationID: number | undefined

    constructor({
        position,
        width,
        height,
        imageSrc = '',
        color
    }: ColoredSpriteProperties) {
        super({
            position,
            width,
            height,
            imageSrc
        })

        this.image = new Image()
        this.image.src = imageSrc
        this.color = color
        this.strokeStrength = 2
        this.powerBar = 0
        this.bonusState = false
        this.bonusDurationID
    }

    render(): void {
        ctx.lineWidth = this.strokeStrength
        ctx.fillStyle = this.color + '50'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height * (this.powerBar / 100))
        ctx.strokeStyle = this.color
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(): void {
        if (this.powerBar >= 100 && !this.bonusState) {
            this.activatBonusState()
        }
        this.render()
    }

    activatBonusState(): void {
        this.bonusState = true
        this.strokeStrength = 5
        this.bonusDurationID = setInterval(() => {
            this.powerBar -= 0.1
            if (this.powerBar <= 0) {
                this.powerBar = 0
                this.deactivateBonusState()
            }
        }, 10)
    }

    deactivateBonusState(): void {
        clearInterval(this.bonusDurationID)
        this.bonusState = false
        this.strokeStrength = 2
    }
}

class Detonator extends Sprite {

    color: string

    constructor({
        position,
        width,
        height,
        color,
        imageSrc = ''
    }: ColoredSpriteProperties) {
        super({
            position,
            width,
            height,
            imageSrc
        })

        this.image = new Image()
        this.image.src = imageSrc
        this.color = color
    }

    update(): void {
        this.draw()
    }

}

class Disk extends Sprite {

    hasPassed: boolean;
    gotErased: boolean;
    id: string;
    gotHit: boolean;
    bonusState: boolean;

    constructor({
        position,
        width,
        height,
        imageSrc = '',
        bonusState,
        id
    }: DiskSpriteProperties) {
        super({
            position,
            width,
            height,
            imageSrc,
        })

        this.image = new Image()
        this.image.src = imageSrc
        this.width = width
        this.height = height
        this.hasPassed = false
        this.gotErased = false
        this.gotHit = false
        this.bonusState = bonusState
        this.id = id
    }

    update(): void {
        this.draw()
        this.position.y += gameManager.gravity

        if (!this.hasPassed &&
            !this.gotHit &&
            this.position.y + 25 > detonatorRed.position.y + detonatorRed.height - 25) {
            this.diskHasPassed()
        }

        if (!this.gotErased && this.position.y > canvas.height) {
            this.eraseDisk()
        }
    }

    detonate(): void {
        if (!this.gotHit &&
            this.position.y - 50 + this.height > detonatorRed.position.y &&
            this.position.y + 50 < detonatorRed.position.y + detonatorRed.height) {
            this.diskGotHit()
        } else {
            diskMissed(this.id)
        }
    }

    diskGotHit(): void {
        gameManager.diskHitCount++
        hitAudio.load()
        hitAudio.play()
        gameManager.updateSkillRating('gain')
        gameManager.updateStreak('hit')
        this.processAccuracy()
        this.gotHit = true
        let target: Disk
        setTimeout(() => {
            switch (this.id) {
                case 'red':
                    target = diskAssembly.red.shift()!
                    diskAssembly.hitDisks.push(target)
                    detonatorRed.image.src = './Assets/Images/Detonator_Hit_red.png'
                    break;
                case 'green':
                    target = diskAssembly.green.shift()!
                    diskAssembly.hitDisks.push(target)
                    detonatorGreen.image.src = './Assets/Images/Detonator_Hit_green.png'
                    break;
                case 'blue':
                    target = diskAssembly.blue.shift()!
                    diskAssembly.hitDisks.push(target)
                    detonatorBlue.image.src = './Assets/Images/Detonator_Hit_blue.png'
                    break;
            }
        }, 0)
    }

    processAccuracy(): void {
        if (this.bonusState) {
            this.image.src = `./Assets/Images/Accuracy_BONUS_${this.id}.png`
            gameManager.updateScore(300)
        } else {

            let offset: number = Math.abs(this.position.y - detonatorRed.position.y)
            let percentage: number = Math.round(((95 - offset) / 95) * 100)

            gameManager.accuracySum += percentage
            gameManager.averageAccuracy = Math.round(gameManager.accuracySum / gameManager.diskHitCount)

            if (percentage >= 93) {
                this.image.src = `./Assets/Images/Accuracy_SUPERPERFECT_${this.id}.png`
                gameManager.increasePowerBar(this.id, 5)
                gameManager.updateScore(100)
            }
            else if (percentage >= 80) {
                this.image.src = `./Assets/Images/Accuracy_PERFECT_${this.id}.png`
                gameManager.increasePowerBar(this.id, 2)
                gameManager.updateScore(65)
            }
            else if (percentage >= 50) {
                this.image.src = `./Assets/Images/Accuracy_GOOD.png`
                gameManager.updateScore(25)
            }
            else {
                this.image.src = `./Assets/Images/Accuracy_MEH.png`
                gameManager.updateScore(10)
            }
        }
    }

    diskHasPassed(): void {
        gameManager.updateSkillRating('lose')
        gameManager.updateStreak('miss')
        this.hasPassed = true
        if (!this.gotHit) {
            this.image.src = `./Assets/Images/Missed_Disk_${this.id}.png`
        }
        let target: Disk
        setTimeout(() => {
            switch (this.id) {
                case 'red':
                    target = diskAssembly.red.shift()!
                    diskAssembly.missedDisks.push(target)
                    break;
                case 'green':
                    target = diskAssembly.green.shift()!
                    diskAssembly.missedDisks.push(target)
                    break;
                case 'blue':
                    target = diskAssembly.blue.shift()!
                    diskAssembly.missedDisks.push(target)
                    break;
            }
        }, 0)
    }

    eraseDisk(): void {
        this.gotErased = true
        setTimeout((): void => {
            if (this.gotHit) {
                diskAssembly.hitDisks.shift()
            } else {
                diskAssembly.missedDisks.shift()
            }
        }, 0);
    }
}

class Timer {

    currentTimerId: number | undefined
    currentTime: number
    maxTime: number
    timeRemainingFraction: number

    constructor() {
        this.currentTimerId
        this.currentTime = 0
        this.maxTime = 100
        this.timeRemainingFraction = this.currentTime / this.maxTime
    }

    render(): void {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 15, Math.PI * 0.5, Math.PI * ((2 * this.timeRemainingFraction) + 0.5))
        ctx.stroke()
    }

    beginTimer(): void {
        this.currentTime = this.maxTime
        this.timeRemainingFraction = this.currentTime / this.maxTime
        this.currentTimerId = setInterval(() => {
            this.currentTime -= 0.01
            if (this.currentTime <= 0) {
                this.endTimer()
                gameManager.endGame()
            } else {
                this.timeRemainingFraction = this.currentTime / this.maxTime
            }
        }, 10);
    }

    endTimer(): void {
        clearInterval(this.currentTimerId)
        this.currentTime = 0
        this.timeRemainingFraction = this.currentTime / this.maxTime
    }
}

class GameManager {

    devMode: boolean
    gameState: string
    tutorialSlide: number
    tutorialDescriptions: string[]
    diskSpawnerId: number | undefined
    gravityLvl: number
    skillRating: number
    gravity: number
    currentScore: number
    streakCounter: number
    scoreMultiplier: number
    disksSpawned: number
    diskHitCount: number
    accuracySum: number
    averageAccuracy: number
    highestGravity: number
    longestStreak: number

    constructor() {
        this.devMode = false
        this.gameState = 'Main-Menu'
        this.tutorialSlide = 1
        this.tutorialDescriptions = [
            `OBJECTIVE <br><br> The objective of the game is to hit the most amount of falling disks as accurately as possible with either the 'A', 'S' or 'D' key. Those keys are your detonators.`,
            `TIMER <br><br> There will be a time limit of 100 seconds. So make every second count!`,
            `SCORE <br><br> You will be rewarded various score points for each hit based off of timing and accuracy.`,
            `GRAVITY LEVEL <br><br> Your 'Gravity Level' determines how quickly the disks spawn and fall. As you hit disks, you will be rewarded skill rating points behind the scenes which contribute towards promoting your Gravity Level. If you miss disks or allow them to pass by then you will lose skill rating and possibly demote your Gravity Level. The highest gravity level is 10.`,
            `STREAK COUNT <br><br> You can grow a streak for hitting multiple disks in a row without missing.`,
            `SCORE MULTIPLIER <br><br> You have a score multiplier which can double, triple or even quadrople the amount of points you earn for each hit. The higher your streak count, more your multiplier grows with 'x4' being the max.`,
            `MISSING A DISK <br><br> If you happen to miss a disk or trigger an empty detonator then your streak count and score multiplier bonus will both reset. Build it back up to earn as many points as possible.`,
            `POWER BAR BONUS MODE <br><br> Hitting an accuracy rating of 'Perfect' or 'Super Perfect' grants you powerbar points for it's respective column up to 100 points. Once you hit the cap your power bar will start to shrink and will spawn special 'Bonus Disks'. Hitting a Bonus Disk grants you 300 points regardless of accuracy (That's triple the max of a regular disk). They do not grant power bar points.`,
            `EASTER EGG <br><br> Press the 'E' key to make a wish ; )`
        ]
        this.diskSpawnerId = undefined
        this.gravityLvl = 1
        this.skillRating = 0
        this.gravity = 4 + this.gravityLvl //gravity should be from 5 to 15 i.e lvl 1 to 10
        this.currentScore = 0
        this.streakCounter = 0
        this.scoreMultiplier = 1
        this.disksSpawned = 0
        this.diskHitCount = 0
        this.accuracySum = 0
        this.averageAccuracy = 0
        this.highestGravity = 1
        this.longestStreak = 0
    }

    resetGameValues(): void {
        this.diskSpawnerId = undefined
        this.gravityLvl = 1
        this.gravity = 4 + this.gravityLvl
        this.skillRating = 0
        this.currentScore = 0
        this.streakCounter = 0
        this.scoreMultiplier = 1
        this.disksSpawned = 0
        this.diskHitCount = 0
        this.accuracySum = 0
        this.averageAccuracy = 0
        this.highestGravity = 1
        this.longestStreak = 0
        diskAssembly = {
            red: [],
            green: [],
            blue: [],
            hitDisks: [],
            missedDisks: []
        }
        runwayRed.powerBar = 0
        runwayGreen.powerBar = 0
        runwayBlue.powerBar = 0
        runwayRed.deactivateBonusState()
        runwayGreen.deactivateBonusState()
        runwayBlue.deactivateBonusState()
        gravityLevelDisplay.innerHTML = String(this.gravityLvl)
        scoreDisplay.innerHTML = String(this.currentScore)
        streakDisplay.innerHTML = String(this.streakCounter)
        scoreMultiplierDisplay.innerHTML = String(this.scoreMultiplier)
    }

    startGame(): void {
        this.resetGameValues()
        this.gameState = 'Active'
        mainMenuDisplay.style.display = 'none'
        postGameDisplay.style.display = 'none'
        inGameDisplay.style.display = 'block'
        canvas.style.transition = '1s'
        canvas.style.boxShadow = `0px 0px 100px rgba(255, 255, 255, 0.1)`
        gameTimer.beginTimer()
        randomDiskSpawner()
    }

    updateScore(score: number): void {
        this.currentScore += (score * this.scoreMultiplier)
        scoreDisplay.innerHTML = String(this.currentScore)
    }

    updateStreak(value: string): void {
        switch (value) {
            case 'miss':
                this.streakCounter = 0
                streakDisplay.style.animation = 'none'
                setTimeout(() => {
                    streakDisplay.style.animation = '0.2s streakReset'
                }, 0)
                break;
            case 'hit':
                this.streakCounter++
                streakDisplay.style.animation = 'none'
                setTimeout(() => {
                    streakDisplay.style.animation = '0.2s pulse'
                }, 0)
                break;
        }
        this.updateMultiplier()

        if (this.longestStreak < this.streakCounter) {
            this.longestStreak = this.streakCounter
        }

        streakDisplay.innerHTML = String(this.streakCounter)
    }

    updateMultiplier(): void {
        if (this.streakCounter >= 25) {
            if (this.scoreMultiplier != 4) {
                scoreMultiplierDisplay.style.animation = 'none'
                setTimeout((): void => {
                    scoreMultiplierDisplay.style.animation = '0.2s pulse'
                })
            }

            scoreMultiplierDisplay.style.fontSize = '2.5em'
            this.scoreMultiplier = 4
        }
        else if (this.streakCounter >= 15) {
            if (this.scoreMultiplier != 3) {
                scoreMultiplierDisplay.style.animation = 'none'
                setTimeout((): void => {
                    scoreMultiplierDisplay.style.animation = '0.2s pulse'
                })
            }

            scoreMultiplierDisplay.style.fontSize = '2.2em'
            this.scoreMultiplier = 3
        }
        else if (this.streakCounter >= 5) {
            if (this.scoreMultiplier != 2) {
                scoreMultiplierDisplay.style.animation = 'none'
                setTimeout((): void => {
                    scoreMultiplierDisplay.style.animation = '0.2s pulse'
                })
            }

            scoreMultiplierDisplay.style.fontSize = '1.8em'
            this.scoreMultiplier = 2
        } else {
            this.scoreMultiplier = 1
            scoreMultiplierDisplay.style.fontSize = '1.5em'
        }

        scoreMultiplierDisplay.innerHTML = `x${this.scoreMultiplier}`
    }

    increasePowerBar(id: string, power: number): void {
        switch (id) {
            case 'red':
                if (!runwayRed.bonusState) {
                    runwayRed.powerBar += power
                    if (runwayRed.powerBar >= 100) {
                        runwayRed.powerBar = 100
                    }
                }
                break;
            case 'green':
                if (!runwayGreen.bonusState) {
                    runwayGreen.powerBar += power
                    if (runwayGreen.powerBar >= 100) {
                        runwayGreen.powerBar = 100
                    }
                }
                break;
            case 'blue':
                if (!runwayBlue.bonusState) {
                    runwayBlue.powerBar += power
                    if (runwayBlue.powerBar >= 100) {
                        runwayBlue.powerBar = 100
                    }
                }
                break;
        }
    }

    updateSkillRating(value: string): void {
        switch (value) {
            case 'gain':
                this.skillRating += 10
                break;
            case 'lose':
                this.skillRating -= 25
                break;
        }

        if (this.skillRating >= 100) {
            this.promoteRank()
        } else if (this.skillRating <= 0) {
            this.demoteRank()
        }
    }

    promoteRank(): void {
        if (this.gravityLvl >= 10) {
            this.skillRating = 100
        } else {
            this.gravityLvl++
            gravityLevelDisplay.style.animation = 'none'
            setTimeout((): void => {
                gravityLevelDisplay.style.animation = '0.2s pulse'
            }, 0)
            this.updateGravityLevel()
            this.skillRating = 0
        }
    }

    demoteRank(): void {
        if (this.gravityLvl <= 1) {
            this.gravityLvl = 1
        } else {
            this.gravityLvl--
            this.updateGravityLevel()
        }
        this.skillRating = 0
    }

    updateGravityLevel(): void {
        canvas.style.transition = '1s'
        canvas.style.boxShadow = `0px 0px 100px rgba(255, 255, 255, ${this.gravityLvl / 15})`
        this.gravity = 4 + this.gravityLvl

        if (this.highestGravity < this.gravityLvl) {
            this.highestGravity = this.gravityLvl
        }

        gravityLevelDisplay.innerHTML = String(this.gravityLvl)
    }

    endGame(): void {
        clearTimeout(this.diskSpawnerId)
        this.finishUpGame()
    }

    finishUpGame() {
        setTimeout(() => {
            if (diskAssembly.red.length === 0 &&
                diskAssembly.green.length === 0 &&
                diskAssembly.blue.length === 0 &&
                diskAssembly.hitDisks.length === 0 &&
                diskAssembly.missedDisks.length === 0
            ) {
                this.loadPostGame()
            } else {
                this.finishUpGame()
            }
        }, 1000)
    }

    loadPostGame() {
        gameManager.gameState = 'Post-Game'

        canvas.style.transition = '1s'
        canvas.style.boxShadow = `0px 0px 100px rgba(255, 255, 255, 0.1)`

        finalScoreDisplay.innerHTML = String(this.currentScore)
        highestGravityDisplay.innerHTML = `Level ${this.highestGravity}`
        longestStreakDisplay.innerHTML = String(this.longestStreak)
        disksHitDisplay.innerHTML = `${this.diskHitCount} out of ${this.disksSpawned} (${Math.floor((this.diskHitCount / this.disksSpawned) * 100)}%)`
        averageAccuracyDisplay.innerHTML = `${this.averageAccuracy}%`

        mainMenuDisplay.style.display = 'none'
        inGameDisplay.style.display = 'none'
        postGameDisplay.style.display = 'flex'
    }

    loadMainMenu() {
        gameManager.gameState = 'Main-Menu'

        canvas.style.transition = '1s'
        canvas.style.boxShadow = `0px 0px 100px rgba(255, 255, 255, 1)`

        inGameDisplay.style.display = 'none'
        postGameDisplay.style.display = 'none'
        mainMenuDisplay.style.display = 'flex'
    }
}