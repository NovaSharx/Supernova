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
        color
    }) {
        super({
            position,
            width,
            height,
            color
        })

        this.velocity = velocity
    }

    spawn() {
        ctx.strokeStyle = this.color
        ctx.fillStyle = this.color
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
        ctx.beginPath()
        ctx.arc(this.position.x + this.width / 2, this.position.y + this.height / 2, this.width / 3, 0, Math.PI * 2, true)
        ctx.stroke()
        ctx.fill()
    }

    update() {
        if (this.position.y > 840/*canvas.height*/) {
            switch (this.color) {
                case 'red':
                    diskAssembly.red.shift()
                    break;
                case 'green':
                    diskAssembly.red.shift()
                    break;
                case 'blue':
                    diskAssembly.red.shift()
                    break;
            }
        }

        this.spawn()
        this.position.y += gravity
    }
}