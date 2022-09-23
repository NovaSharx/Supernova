class Sprite {
    constructor({
        position,
        color,
        width,
        height,
        imageSrc
    }) {
        this.position = position
        this.color = color
        this.width = width
        this.height = height
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

    }

    render() {
        ctx.lineWidth = 5
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
        velocity,
        color,
    }) {
        super({
            position,
            width,
            height,
            color
        })

        this.velocity = velocity
        this.hasPassed = false
        this.gotErased = false
        this.gotHit = false
    }

    render() {
        ctx.strokeStyle = this.color
        ctx.fillStyle = this.color
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
        ctx.beginPath()
        ctx.arc(this.position.x + this.width / 2, this.position.y + this.height / 2, this.width / 3, 0, Math.PI * 2, true)
        ctx.stroke()
        ctx.fill()
    }

    update() {
        if (this.position.y + 25 > detonatorRed.position.y + detonatorRed.height - 25 && !this.hasPassed) {
            this.diskHasPassed()
        }

        if (!this.gotErased && this.position.y > 840/*canvas.height*/) {
            this.eraseDisk()
        }

        this.render()
        this.position.y += gravity
    }

    detonate() {
        if (!this.gotHit &&
            this.position.y - 50 + this.height > detonatorRed.position.y &&
            this.position.y + 50 < detonatorRed.position.y + detonatorRed.height) {
            this.diskGotHit()
        } else {
            this.diskMissed()
        }
    }

    diskGotHit() {
        this.gotHit = true
        this.color = '#FFFFFF'
        this.color += '25'
        console.log(this.position.y)
        console.log(detonatorRed.position.y)
    }

    diskMissed() {
        console.log('MISS')
    }

    diskHasPassed() {
        this.hasPassed = true
        switch (this.color) {
            case '#DB3324':
                missedDisks.push(diskAssembly.red.shift())
                break;
            case '#24DB33':
                missedDisks.push(diskAssembly.green.shift())
                break;
            case '#3324DB':
                missedDisks.push(diskAssembly.blue.shift())
                break;
        }
        // console.log('PASSED')
    }

    eraseDisk() {
        switch (this.color) {
            case '#DB3324':
                missedDisks.shift()
                break;
            case '#24DB33':
                missedDisks.shift()
                break;
            case '#3324DB':
                missedDisks.shift()
                break;
        }
        this.gotErased = true
        // console.log('ERASED')
    }
}