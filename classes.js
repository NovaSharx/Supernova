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

    update() {
        this.draw()
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
    }

    render() {
        ctx.lineWidth = this.strokeStrength
        ctx.fillStyle = this.color + '50'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height * (this.powerBar / 100))
        ctx.strokeStyle = this.color
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        if (this.powerBar >= 100) {
            this.strokeStrength = 5
        }
        this.render()
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

    render() {
        ctx.lineWidth = 2
        ctx.strokeStyle = this.color
        ctx.fillStyle = this.color + '50'
        ctx.beginPath()
        ctx.arc(this.position.x + this.width / 2, this.position.y + this.height / 2, this.width / 2.5, 0, Math.PI * 2, true)
        ctx.stroke()
        ctx.fill()
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
        this.id = id
    }

    update() {
        this.draw()
        this.position.y += gravity

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

        accuracyCount++

        if (!this.gotHit &&
            this.position.y - 50 + this.height > detonatorRed.position.y &&
            this.position.y + 50 < detonatorRed.position.y + detonatorRed.height) {
            this.diskGotHit()
        } else {
            diskMissed(this.id)
        }
    }

    diskGotHit() {
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
        let offset = Math.abs(this.position.y - detonatorRed.position.y)
        let percentage = Math.round(((95 - offset) / 95) * 100)

        accuracySum += percentage
        averageAccuracy = Math.round(accuracySum / accuracyCount)

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

    diskHasPassed() {
        accuracyCount++
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

class GameManager {
    constructor() {
        this.currentScore = 0
        this.streakCounter = 0
        this.scoreMultiplier = 1
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

        streakDisplay.innerHTML = this.streakCounter
    }

    updateMultiplier() {
        if (this.streakCounter >= 75) {
            if (this.scoreMultiplier != 4) {
                scoreMultiplierDisplay.style.animation = 'none'
                setTimeout(() => {
                    scoreMultiplierDisplay.style.animation = '0.2s pulse'
                })
            }

            this.scoreMultiplier = 4
        }
        else if (this.streakCounter >= 50) {
            if (this.scoreMultiplier != 3) {
                scoreMultiplierDisplay.style.animation = 'none'
                setTimeout(() => {
                    scoreMultiplierDisplay.style.animation = '0.2s pulse'
                })
            }

            this.scoreMultiplier = 3
        }
        else if (this.streakCounter >= 25) {
            if (this.scoreMultiplier != 2) {
                scoreMultiplierDisplay.style.animation = 'none'
                setTimeout(() => {
                    scoreMultiplierDisplay.style.animation = '0.2s pulse'
                })
            }

            this.scoreMultiplier = 2
        } else {
            this.scoreMultiplier = 1
        }

        scoreMultiplierDisplay.innerHTML = `x${this.scoreMultiplier}`
    }

    increasePowerBar(id, power) {
        switch (id) {
            case 'red':
                if (runwayRed.powerBar >= 100) {
                    runwayRed.powerBar = 100
                } else {
                    runwayRed.powerBar += power
                }
                break;
            case 'green':
                if (runwayGreen.powerBar >= 100) {
                    runwayGreen.powerBar = 100
                } else {
                    runwayGreen.powerBar += power
                }
                break;
            case 'blue':
                if (runwayBlue.powerBar >= 100) {
                    runwayBlue.powerBar = 100
                } else {
                    runwayBlue.powerBar += power
                }
                break;
        }
    }
}