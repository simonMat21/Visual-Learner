// Animator.js

export class Animator {
  constructor() {
    this.delayMult = 1; // this is used to slow down the animation
    this.n = 0;
    this.w = 0;
    this.aniCount = 0;
    // this might cause issues later
    this.g = [0]; // this is used to store the initial value of the animation
    this.v = [0];

    this.objectIdArray = [];
    this.funtionsDictionary = {};
  }

  initialVal(a, b, id) {
    if (this.g[id] == 0 || this.g[id] == undefined) {
      this.g[id] = a - b;
    }
    return this.g[id];
  }
  initialValSeq(a, b, id) {
    if (this.v[id] == 0 || this.v[id] == undefined) {
      this.v[id] = a - b;
    }
    return this.v[id];
  }

  /**
   * does the given function for the given number of frames.
   * @param {number} no_frame - Number of frames to animate for.
   * @param {function} func - Animation function to be executed.
   */
  sub_animate(no_frame, func) {
    if (this.n < no_frame) {
      func();
      this.n++;
      return 0;
    } else {
      this.g = [0];
      return 1;
    }
  }

  /**
   * Takes in an array of animate functions and executes them one after the other.
   * @param {[function]} arr - Array of functions to be executed in sequence.
   */
  animationSequence(arr) {
    if (this.w < arr.length && arr[this.w]()) {
      this.n = 0;
      this.w++;
      if (this.w == arr.length) {
        this.w++;
        this.v = [0];
        return 1;
      }
    }
    return 0;
  }

  /**
   * Animates the objects in A for the given duration all at the same time.
   * @param {number} duration - Animation time in frames.
   * @param {[object, number, number, number]} A - [object, x, y, opacity].
   */
  animate(duration, A) {
    return () => {
      return this.sub_animate(duration * this.delayMult, () => {
        A.forEach(([a, x, y, opacity]) => {
          a.opacity += opacity / (duration * this.delayMult);
          a.x += x / (duration * this.delayMult);
          a.y += y / (duration * this.delayMult);
        });
      });
    };
  }

  to(duration, A) {
    return () => {
      return this.sub_animate(duration * this.delayMult, () => {
        A.forEach(([obj, x, y, opacity]) => {
          obj.opacity +=
            this.initialVal(opacity, obj.opacity, 1001) /
            (duration * this.delayMult);
          obj.x +=
            this.initialVal(x, obj.x, 1002) / (duration * this.delayMult);
          obj.y +=
            this.initialVal(y, obj.y, 1003) / (duration * this.delayMult);
        });
      });
    };
  }

  delay(duration) {
    return () => {
      return this.sub_animate(duration * this.delayMult, () => {});
    };
  }

  mainAnimationSequence(arr) {
    //arr = [{name:"",objArgs:[0,1,2],othArgs:[0,1]}]

    if (this.aniCount < arr.length) {
      const Arg = arr[this.aniCount];
      if (Arg.funcName in this.funtionsDictionary) {
        if (
          this.funtionsDictionary[Arg.funcName](
            Arg.objArgs.map((id) => this.objectIdArray[id]),
            Arg.othArgs
          )
        ) {
          this.w = 0;
          this.aniCount++;
        }
      }
    }
  }
}
