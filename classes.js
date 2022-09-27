class Sprite {
    constructor({
        position,
        width,
        height,
        image,
        imageSrc,
        color
    }) {
        this.position = position
        this.color = color
        this.width = width
        this.height = height
        this.image = new Image()
        this.imageSrc = imageSrc
    }

    render() {
        console.log('hi')
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
        color
    }) {
        super({
            position,
            width,
            height,
            color
        })
        this.strokeStrength = 5

    }

    render() {
        ctx.lineWidth = this.strokeStrength
        ctx.fillStyle = this.color + '50'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.strokeStyle = this.color
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
    }

}

class Detonator extends Sprite {
    constructor({
        position,
        width,
        height,
        color
    }) {
        super({
            position,
            width,
            height,
            color
        })

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
                    hitDisks.push(target)
                    break;
                case 'green':
                    target = diskAssembly.green.shift()
                    hitDisks.push(target)
                    break;
                case 'blue':
                    target = diskAssembly.blue.shift()
                    hitDisks.push(target)
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
                    missedDisks.push(target)
                    break;
                case 'green':
                    target = diskAssembly.green.shift()
                    missedDisks.push(target)
                    break;
                case 'blue':
                    target = diskAssembly.blue.shift()
                    missedDisks.push(target)
                    break;
            }
        }, 0)
    }

    eraseDisk() {
        this.gotErased = true
        setTimeout(() => {
            if (this.gotHit) {
                hitDisks.shift()
            } else {
                missedDisks.shift()
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
        if (this.streakCounter >= 75) {
            this.streakMultiplier = 4
        }
        else if (this.streakCounter >= 50) {
            this.streakMultiplier = 3
        }
        else if (this.streakCounter >= 25) {
            this.streakMultiplier = 2
        } else {
            this.streakMultiplier = 1
        }
        
        streakMultiplierDisplay.innerHTML = `x${this.streakMultiplier}`
    }
}