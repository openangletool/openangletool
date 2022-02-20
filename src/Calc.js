class Calc {

    constructor() {
        this.solved = false;
    }

    set(p) {
        this.dw = Number.parseFloat(p.dw);
        this.lp = Number.parseFloat(p.lp);
        this.beta = this.rad(Number.parseFloat(p.beta));
        this.ds = Number.parseFloat(p.ds);
        this.dj = Number.parseFloat(p.dj);
        this.o = Number.parseFloat(p.o);
        this.hc = Number.parseFloat(p.hc);

        this.solve();
    }

    rad(d) {
        return d / 180 * Math.PI;
    }

    deg(r) {
        return r * 180 / Math.PI;
    }

    solve() {
        var a = 45./180.*Math.PI;
        var b = Math.PI;
        var xa = this.x(a);
        var xb = this.x(b);
        const eps = 1e-5;

        console.log('solve: a='+a+', b='+b+', xa='+xa+', xb='+xb);

	this.solved = false;
        while ((Math.sign(xa) !== Math.sign(xb)) && (b - a) > eps) {
            var m = 0.5 * (a + b);
            var xm = this.x(m);
            if (Math.sign(xa) === Math.sign(xm)) {
                a = m;
                xa = xm;
            } else {
                b = m;
                xb = xm;
            }
	    this.solved = true;
        }

        if (!this.solved) {
	   return;
	}

        this.alpha = 0.5 * (a + b);

        this.h = 0.5 * (
            this.ds * Math.cos(this.alpha + this.beta)
            - 2 * this.lp * Math.cos(this.alpha + this.beta)
            + this.dw * Math.sin(this.alpha)
            - this.dj * Math.sin(this.alpha + this.beta)
            - this.ds * Math.sin(this.alpha + this.beta)
        );

        this.hr = Math.sqrt(this.o * this.o + this.h * this.h)
            + 0.5 * this.ds
            - 0.5 * this.dw;

        this.hn = this.h
            + 0.5 * this.ds
            - this.hc;
    }

    x(alpha) {
        return -this.o
            + 0.5 * this.dw * Math.cos(alpha)
            - 0.5 * (this.dj + this.ds) * Math.cos(alpha + this.beta)
            + (-0.5 * this.ds + this.lp) * Math.sin(alpha + this.beta);
    }

    get() {
        if (this.solved) {
	   return {
	       alpha: this.deg(this.alpha).toFixed(1).toString(),
	       h: this.h.toFixed(1).toString(),
	       hr: this.hr.toFixed(1).toString(),
	       hn: this.hn.toFixed(1).toString()
	   };
        }
	return {
	    alpha: '-',
	    h: '-',
	    hr: '-',
	    hn: '-'
	};
    }

}

export default Calc;
