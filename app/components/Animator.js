// Animator.js

export class Animator {
  constructor() {
    this.delayMult = 1; // this is used to slow down the animation
    this.n = 0;
    this.w = 0;
    this.aniCount = 0;
    // this might cause issues later
    this.g = []; // this is used to store the initial value of the animation
    this.v = [];
    this.initialValArray = [];

    this.initialFuncKeyArr = [];
    this.initialFuncSeqKeyArr = [];

    this.objectIdArray = [];
    this.funtionsDictionary = {};
  }

  setDelayMult(val) {
    if (this.n == 0 && val > 0) {
      this.delayMult = val;
    }
  }

  /**
   * this gets the difference and refreshes it at the end of the animation.
   * @param {*} a
   * @param {*} b
   * @param {*} id unique id for the object.
   * @returns
   */
  initialVal(a, b, id) {
    if (this.g[id] == 0 || this.g[id] == undefined) {
      this.g[id] = a - b;
    }
    return this.g[id];
  }

  initialFunc(func, id = 0) {
    if (this.initialFuncKeyArr[id] == undefined) {
      this.initialFuncKeyArr[id] = func() || -1;
    }
    return this.initialFuncKeyArr[id];
  }

  initialFuncSeq(func, id = 0) {
    if (this.initialFuncSeqKeyArr[id] == undefined) {
      this.initialFuncSeqKeyArr[id] = func() || -1;
    }
    return this.initialFuncSeqKeyArr[id];
  }

  /**
   * this gets the difference and refreshes it at the end of the animation sequence.
   * @param {*} a
   * @param {*} b
   * @param {*} id
   * @returns
   */
  initialDiffSeq(a, b = 0, id = 0) {
    if (this.v[id] == 0 || this.v[id] == undefined) {
      this.v[id] = a - b;
    }
    return this.v[id];
  }

  /**
   * this gets the value and refreshes it at the end of the animation sequence.
   * @param {*} a
   * @param {*} id
   * @returns
   */
  iV(a = null, id = 0) {
    if (a !== null && this.initialValArray[id] === undefined) {
      this.initialValArray[id] = a;
    }
    return this.initialValArray[id];
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
      this.initialFuncKeyArr = [];
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
        this.v = [];
        this.initialValArray = [];
        this.initialFuncSeqKeyArr = [];
        return 1;
      }
    }
    return 0;
  }

  animateFunc(duration, func) {
    duration = duration <= 1 ? 1 : Math.floor(duration * this.delayMult);
    return () => {
      return this.sub_animate(duration, func);
    };
  }

  /**
   * Animates the objects in A for the given duration all at the same time.
   * @param {number} duration - Animation time in frames.
   * @param {[object, number, number, number]} A - [object, x, y, opacity].
   */
  animate(duration, A) {
    duration = duration <= 1 ? 1 : Math.floor(duration * this.delayMult);
    if (A.length == 0) {
      duration = 0;
    }
    return () => {
      return this.sub_animate(duration, () => {
        A.forEach(([a, x, y, opacity]) => {
          a.opacity += opacity / duration;
          a.x += x / duration;
          a.y += y / duration;
        });
      });
    };
  }

  to(duration, A) {
    duration = duration <= 1 ? 1 : Math.floor(duration * this.delayMult);
    if (A.length == 0) {
      duration = 0;
    }
    return () => {
      return this.sub_animate(duration, () => {
        A.forEach(([obj, x, y, opacity], ind) => {
          obj.opacity +=
            this.initialVal(opacity, obj.opacity, 1001 + ind * 3) / duration;
          obj.x += this.initialVal(x, obj.x, 1002 + ind * 3) / duration;
          obj.y += this.initialVal(y, obj.y, 1003 + ind * 3) / duration;
        });
      });
    };
  }

  delay(duration) {
    return () => {
      return this.sub_animate(duration, () => {});
    };
  }

  mainAnimationSequence(arr) {
    //arr = [{name:"",objArgs:[0,1,2],othArgs:[0,1]}]
    if (this.aniCount < arr.length) {
      const Arg = arr[this.aniCount];
      if (Arg.funcName in this.funtionsDictionary) {
        if (
          this.funtionsDictionary[Arg.funcName](
            (Arg.objArgs || []).map((id) => this.objectIdArray[id]),
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
