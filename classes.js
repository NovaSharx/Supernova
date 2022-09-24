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
        color,
        id
    }) {
        super({
            position,
            width,
            height,
            color
        })

        this.hasPassed = false
        this.gotErased = false
        this.gotHit = false
        this.id = id
        this.index = null
    }

    render() {
        // ctx.strokeStyle = this.color
        ctx.fillStyle = this.color
        // ctx.lineWidth = 5
        // ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
        ctx.beginPath()
        ctx.arc(this.position.x + this.width / 2, this.position.y + this.height / 2, this.width / 3, 0, Math.PI * 2, true)
        // ctx.stroke()
        ctx.fill()
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
        if (!this.gotHit &&
            this.position.y - 50 + this.height > detonatorRed.position.y &&
            this.position.y + 50 < detonatorRed.position.y + detonatorRed.height) {
            this.diskGotHit()
        } else {
            diskMissed()
        }
    }

    diskGotHit() {
        console.log('HIT!')
        this.gotHit = true
        this.color = '#FFFFFF25'
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

    diskHasPassed() {
        this.hasPassed = true
        if (!this.gotHit) {
            this.color += '50'
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