class Sprite {
    constructor({
        position,
        color,
        width,
        height
    }) {
        this.position = position
        this.color = color
        this.width = width
        this.height = height
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
        super ({
            position,
            width,
            height,
            color
        })

    }

    render() {
        ctx.fillStyle = this.color+'50'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.strokeStyle = this.color
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
    }

}

class Detonator extends Sprite {
    constructor({
        position,
        width = 100,
        height = 100,
        color
    }) {
        super ({
            position,
            width,
            height,
            color
        })

    }

    render() {
        ctx.strokeStyle = this.color
        ctx.lineWidth = 5
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
        ctx.beginPath()
        ctx.arc(this.position.x + this.width/2, this.position.y + this.height/2, this.width/4, 0, Math.PI * 2, true)
        ctx.stroke()
    }
}