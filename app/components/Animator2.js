// Animator.js
export function a2o(obj, x, y, opacity) {
  return {
    obj: obj,
    changes: { x: x, y: y, opacity: opacity },
  };
}

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
    this.functionsDictionary = {};

    this.listOfActions = [];

    this.executing = false;
  }

  setDelayMult(val) {
    if (this.n == 0 && val > 0) {
      this.delayMult = val;
    }
  }

  initialVal(a, id) {
    if (this.g[id] == 0 || this.g[id] == undefined) {
      this.g[id] = a;
    }
    return this.g[id];
  }

  initialValSeq(a = null, id = 0) {
    if (a !== null && this.initialValArray[id] === undefined) {
      this.initialValArray[id] = a;
    }
    return this.initialValArray[id];
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

  animate(duration, A) {
    duration = duration <= 1 ? 1 : Math.floor(duration * this.delayMult);
    if (A.length === 0) {
      duration = 0;
    }

    return () => {
      return this.sub_animate(duration, () => {
        A.forEach(({ obj, changes }) => {
          for (const key in changes) {
            if (typeof changes[key] === "number") {
              obj[key] += changes[key] / duration;
            }
          }
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
        A.forEach(({ obj, changes }, ind) => {
          let j = 1;
          for (const key in changes) {
            if (typeof changes[key] === "number") {
              obj[key] +=
                this.initialVal(changes[key] - obj[key], 1001 * j + ind) /
                duration;
            }
            j++;
          }
        });
      });
    };
  }

  from(duration, A) {
    duration = duration <= 1 ? 1 : Math.floor(duration * this.delayMult);
    if (A.length == 0) {
      duration = 0;
    }
    return () => {
      return this.sub_animate(duration, () => {
        let copy = this.iVSub(
          A.map(({ obj }) => structuredClone(obj)),
          1000
        );
        if (this.iVSub(null, 1001) === undefined) {
          A.forEach(({ obj, changes }) => {
            for (const key in changes) {
              if (typeof changes[key] === "number") {
                obj[key] += changes[key];
              }
            }
          });
          this.iVSub(1, 1001);
        }
        A.forEach(({ obj, changes }, ind) => {
          obj.opacity += (copy[ind].opacity - opacity) / duration;
          obj.x += (copy[ind].x - x) / duration;
          obj.y += (copy[ind].y - y) / duration;
        });
      });
    };
  }

  mix(duration, A) {
    duration = duration <= 1 ? 1 : Math.floor(duration * this.delayMult);
    if (A.length == 0) {
      duration = 0;
    }
    return () => {
      return this.sub_animate(duration, () => {
        let copy = this.iVSub(
          A.map(([_, obj]) => structuredClone(obj)),
          1000
        );
        if (this.iVSub(null, 1001) === undefined) {
          A.filter(([tag]) => tag === "from").forEach(
            ([_, obj, x, y, opacity]) => {
              obj.x = x;
              obj.y = y;
              obj.opacity = opacity;
            }
          );
          this.iVSub(1, 1001);
        }
        A.forEach(([tag, obj, x, y, opacity], ind) => {
          if (tag === "from") {
            obj.opacity += (copy[ind].opacity - opacity) / duration;
            obj.x += (copy[ind].x - x) / duration;
            obj.y += (copy[ind].y - y) / duration;
          } else if (tag === "to") {
            obj.opacity +=
              this.initialVal(opacity, obj.opacity, 1002 + ind * 3) / duration;
            obj.x += this.initialVal(x, obj.x, 1003 + ind * 3) / duration;
            obj.y += this.initialVal(y, obj.y, 1004 + ind * 3) / duration;
          } else if (tag === "animate") {
            obj.opacity += opacity / duration;
            obj.x += x / duration;
            obj.y += y / duration;
          }
        });
      });
    };
  }

  delay(duration) {
    return () => {
      return this.sub_animate(duration, () => {});
    };
  }

  mainAnimationSequence() {
    //arr = [{name:"",Args:[0,1]}]
    if (this.aniCount < this.listOfActions.length) {
      this.executing = true;
      const Arg = this.listOfActions[this.aniCount];
      if (Arg.funcName === undefined) {
        if (Arg.func(Arg.Args || [])) {
          this.w = 0;
          this.aniCount++;
        }
      } else if (Arg.funcName in this.functionsDictionary) {
        if (this.functionsDictionary[Arg.funcName](Arg.Args || [])) {
          this.w = 0;
          this.aniCount++;
        }
      }
    } else {
      this.executing = false;
    }
  }

  addStage(stage) {
    this.listOfActions.push(stage);
  }
}
