class Sprite {
    constructor({
        position,
        width,
        height,
        imageSrc,
    }) {
        this.position = position
        this.width = width
        this.height = height
        this.image = new Image()
        // this.image.src = imageSrc
    }

    draw() {
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
    constructor({
        position,
        width,
        height,
        color,
        imageSrc
    }) {
        super({
            position,
            width,
            height,
            imageSrc
        })

        this.image = new Image()
        // this.image.src = imageSrc
        this.color = color
        this.strokeStrength = 2
        this.powerBar = 0
        this.bonusState = false
        this.bonusDurationID
    }

    render() {
        ctx.lineWidth = this.strokeStrength
        ctx.fillStyle = this.color + '50'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height * (this.powerBar / 100))
        ctx.strokeStyle = this.color
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        if (this.powerBar >= 100 && !this.bonusState) {
            this.activatBonusState()
        }
        this.render()
    }

    activatBonusState() {
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

    deactivateBonusState() {
        clearInterval(this.bonusDurationID)
        this.bonusState = false
        this.strokeStrength = 2
    }
}

class Detonator extends Sprite {
    constructor({
        position,
        width,
        height,
        color,
        imageSrc
    }) {
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

    update() {
        this.draw()
    }
}

class Disk extends Sprite {
    constructor({
        position,
        width,
        height,
        imageSrc,
        bonusState,
        id
    }) {
        super({
            position,
            width,
            height,
            imageSrc,
        })

        this.image = new Image()
        this.image.src = imageSrc
        this.width = 150
        this.height = 150
        this.hasPassed = false
        this.gotErased = false
        this.gotHit = false
        this.bonusState = bonusState
        this.id = id
    }

    update() {
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

    detonate() {
        if (!this.gotHit &&
            this.position.y - 50 + this.height > detonatorRed.position.y &&
            this.position.y + 50 < detonatorRed.position.y + detonatorRed.height) {
            this.diskGotHit()
        } else {
            diskMissed(this.id)
        }
    }

    diskGotHit() {
        gameManager.diskHitCount++
        hitAudio.load()
        hitAudio.play()
        gameManager.updateSkillRating('gain')
        gameManager.updateStreak('hit')
        this.processAccuracy()
        this.gotHit = true
        let target
        setTimeout(() => {
            switch (this.id) {
                case 'red':
                    target = diskAssembly.red.shift()
                    diskAssembly.hitDisks.push(target)
                    detonatorRed.image.src = './Assets/Images/Detonator_Hit_red.png'
                    break;
                case 'green':
                    target = diskAssembly.green.shift()
                    diskAssembly.hitDisks.push(target)
                    detonatorGreen.image.src = './Assets/Images/Detonator_Hit_green.png'
                    break;
                case 'blue':
                    target = diskAssembly.blue.shift()
                    diskAssembly.hitDisks.push(target)
                    detonatorBlue.image.src = './Assets/Images/Detonator_Hit_blue.png'
                    break;
            }
        }, 0)
    }

    processAccuracy() {
        if (this.bonusState) {
            this.image.src = `./Assets/Images/Accuracy_BONUS_${this.id}.png`
            gameManager.updateScore(300)
        } else {

            let offset = Math.abs(this.position.y - detonatorRed.position.y)
            let percentage = Math.round(((95 - offset) / 95) * 100)

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

    diskHasPassed() {
        gameManager.updateSkillRating('lose')
        gameManager.updateStreak('miss')
        this.hasPassed = true
        if (!this.gotHit) {
            this.image.src = `./Assets/Images/Missed_Disk_${this.id}.png`
        }
        let target
        setTimeout(() => {
            switch (this.id) {
                case 'red':
                    target = diskAssembly.red.shift()
                    diskAssembly.missedDisks.push(target)
                    break;
                case 'green':
                    target = diskAssembly.green.shift()
                    diskAssembly.missedDisks.push(target)
                    break;
                case 'blue':
                    target = diskAssembly.blue.shift()
                    diskAssembly.missedDisks.push(target)
                    break;
            }
        }, 0)
    }

    eraseDisk() {
        this.gotErased = true
        setTimeout(() => {
            if (this.gotHit) {
                diskAssembly.hitDisks.shift()
            } else {
                diskAssembly.missedDisks.shift()
            }
        }, 0);
    }
}

class Timer {
    constructor() {
        this.currentTimerId
        this.currentTime = 0
        this.maxTime = 100
        this.timeRemainingFraction = this.currentTime / this.maxTime
    }

    render() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 15, Math.PI * 0.5, Math.PI * ((2 * this.timeRemainingFraction) + 0.5))
        ctx.stroke()
    }

    beginTimer() {
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

    endTimer() {
        clearInterval(this.currentTimerId)
        this.currentTime = 0
        this.timeRemainingFraction = this.currentTime / this.maxTime
    }
}

class GameManager {
    constructor() {
        this.devMode = false
        this.gameState = 'Menu'
        this.diskSpawnerId = null
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

    resetGameValues() {
        this.diskSpawnerId = null
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
        gravityLevelDisplay.innerHTML = this.gravityLvl
        scoreDisplay.innerHTML = this.currentScore
        streakDisplay.innerHTML = this.streakCounter
        scoreMultiplierDisplay.innerHTML = this.scoreMultiplier
    }

    startGame() {
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

    updateScore(score) {
        this.currentScore += (score * this.scoreMultiplier)
        scoreDisplay.innerHTML = this.currentScore
    }

    updateStreak(value) {
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

        streakDisplay.innerHTML = this.streakCounter
    }

    updateMultiplier() {
        if (this.streakCounter >= 25) {
            if (this.scoreMultiplier != 4) {
                scoreMultiplierDisplay.style.animation = 'none'
                setTimeout(() => {
                    scoreMultiplierDisplay.style.animation = '0.2s pulse'
                })
            }

            scoreMultiplierDisplay.style.fontSize = '2.5em'
            this.scoreMultiplier = 4
        }
        else if (this.streakCounter >= 15) {
            if (this.scoreMultiplier != 3) {
                scoreMultiplierDisplay.style.animation = 'none'
                setTimeout(() => {
                    scoreMultiplierDisplay.style.animation = '0.2s pulse'
                })
            }

            scoreMultiplierDisplay.style.fontSize = '2.2em'
            this.scoreMultiplier = 3
        }
        else if (this.streakCounter >= 5) {
            if (this.scoreMultiplier != 2) {
                scoreMultiplierDisplay.style.animation = 'none'
                setTimeout(() => {
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

    increasePowerBar(id, power) {
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

    updateSkillRating(value) {
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

    promoteRank() {
        if (this.gravityLvl >= 10) {
            this.skillRating = 100
        } else {
            this.gravityLvl++
            gravityLevelDisplay.style.animation = 'none'
            setTimeout(() => {
                gravityLevelDisplay.style.animation = '0.2s pulse'
            }, 0)
            this.updateGravityLevel()
            this.skillRating = 0
        }
    }

    demoteRank() {
        if (this.gravityLvl <= 1) {
            this.gravityLvl = 1
        } else {
            this.gravityLvl--
            this.updateGravityLevel()
        }
        this.skillRating = 0
    }

    updateGravityLevel() {
        canvas.style.transition = '1s'
        canvas.style.boxShadow = `0px 0px 100px rgba(255, 255, 255, ${this.gravityLvl / 15})`
        this.gravity = 4 + this.gravityLvl

        if (this.highestGravity < this.gravityLvl) {
            this.highestGravity = this.gravityLvl
        }

        gravityLevelDisplay.innerHTML = this.gravityLvl
    }

    endGame() {
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

        finalScoreDisplay.innerHTML = this.currentScore
        highestGravityDisplay.innerHTML = `Level ${this.highestGravity}`
        longestStreakDisplay.innerHTML = this.longestStreak
        disksHitDisplay.innerHTML = `${this.diskHitCount} out of ${this.disksSpawned} (${Math.floor((this.diskHitCount/this.disksSpawned) * 100)}%)`
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