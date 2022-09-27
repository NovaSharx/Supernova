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

    render() {
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
        this.render()
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
        this.strokeStrength = 5
        this.powerBar = 0
    }

    render() {
        ctx.lineWidth = this.strokeStrength
        ctx.fillStyle = this.color + '50'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height * (this.powerBar / 100))
        ctx.strokeStyle = this.color
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
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
        // this.image.src = imageSrc
        this.color = color
    }

    render() {
        ctx.lineWidth = 5
        ctx.strokeStyle = this.color
        ctx.fillStyle = this.color + '40'
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
        ctx.beginPath()
        ctx.arc(this.position.x + this.width / 2, this.position.y + this.height / 2, this.width / 3, 0, Math.PI * 2, true)
        ctx.stroke()
        ctx.fill()
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
        this.render()
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
            diskMissed()
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
                    break;
                case 'green':
                    target = diskAssembly.green.shift()
                    diskAssembly.hitDisks.push(target)
                    break;
                case 'blue':
                    target = diskAssembly.blue.shift()
                    diskAssembly.hitDisks.push(target)
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
            gameManager.increasePowerBar(this.id)
            gameManager.updateScore(100)
        }
        else if (percentage >= 80) {
            this.image.src = `./Assets/Images/Accuracy_PERFECT_${this.id}.png`
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
        this.streakMultiplier = 1
    }

    updateScore(score) {
        this.currentScore += (score * this.streakMultiplier)
        scoreDisplay.innerHTML = this.currentScore
    }

    updateStreak(value) {
        switch (value) {
            case 'miss':
                this.streakCounter = 0
                break;
            case 'hit':
                this.streakCounter++
                break;
        }
        this.updateMultiplier()

        streakDisplay.innerHTML = this.streakCounter
    }

    updateMultiplier() {
        if (this.streakCounter >= 7) {
            // streakMultiplierDisplay.style.fontSize = '2.5em'
            this.streakMultiplier = 4
        }
        else if (this.streakCounter >= 5) {
            // streakMultiplierDisplay.style.fontSize = '2.2em'
            this.streakMultiplier = 3
        }
        else if (this.streakCounter >= 2) {
            // streakMultiplierDisplay.style.fontSize = '1.8em'
            this.streakMultiplier = 2
        } else {
            // streakMultiplierDisplay.style.fontSize = '1.5em'
            this.streakMultiplier = 1
        }

        streakMultiplierDisplay.innerHTML = `x${this.streakMultiplier}`
    }

    increasePowerBar(id) {
        switch (id) {
            case 'red':
                if (runwayRed.powerBar >= 100) {
                    runwayRed.powerBar = 100
                } else {
                    runwayRed.powerBar += 5
                }
                break;
            case 'green':
                if (runwayGreen.powerBar >= 100) {
                    runwayGreen.powerBar = 100
                } else {
                    runwayGreen.powerBar += 5
                }
                break;
            case 'blue':
                if (runwayBlue.powerBar >= 100) {
                    runwayBlue.powerBar = 100
                } else {
                    runwayBlue.powerBar += 5
                }
                break;
        }
    }
}