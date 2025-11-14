# A Dice With Advanced Animation | Playground Documentation | Somnia Docs

Copy

  1. [Resources](/playground-documentation/resources)
  2. [MML Examples](/playground-documentation/resources/mml-examples)



# A Dice With Advanced Animation

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FSJkiFyRMkfSoWwGGayvm%2Fimage.png&width=768&dpr=4&quality=100&sign=a3fb544c&sv=2)

Copy
    
    
    <m-model id="dice" src="https://public.mml.io/dice.glb" y="1" collide="true" onclick="rollDice()">
      <m-attr-anim id="rx" attr="rx" ping-pong="false" easing="linear" start="0" end="0" loop="false" start-time="0" duration="1"></m-attr-anim>
      <m-attr-anim id="ry" attr="ry" ping-pong="false" easing="linear" start="0" end="0" loop="false" start-time="0" duration="1"></m-attr-anim>
      <m-attr-anim id="rz" attr="rz" ping-pong="false" easing="linear" start="0" end="0" loop="false" start-time="0" duration="1"></m-attr-anim>
      <m-attr-anim id="y" attr="y" ping-pong="false" easing="linear" start="1" end="1" loop="false" start-time="0" duration="1"></m-attr-anim>
    </m-model>
    <script>
      let rolling = false;
      let rollResult = 1;
      let rollDuration = 750;
      let rollHeight = 3.1;
    
      function radToDeg(radians) {
        return radians * (180 / Math.PI);
      }
    
      function animate(attr, easing, targetRotation, duration) {
        rolling = true;
        const mAttrAnim = document.getElementById(attr);
        const newStart = mAttrAnim.getAttribute("end");
        mAttrAnim.setAttribute("easing", easing);
        mAttrAnim.setAttribute("start", newStart);
        mAttrAnim.setAttribute("end", targetRotation);
        mAttrAnim.setAttribute("loop", "false");
        mAttrAnim.setAttribute("duration", duration);
        mAttrAnim.setAttribute("start-time", document.timeline.currentTime);
        setTimeout(() => {
          rolling = false;
        }, duration + 10);
      }
    
      function rollDice() {
        if (rolling) return;
        const rollMap = {
          1: {
            rx: 0,
            ry: 0,
            rz: 0
          },
          2: {
            rx: 0,
            ry: 0,
            rz: radToDeg(-Math.PI / 2)
          },
          3: {
            rx: radToDeg(-Math.PI / 2),
            ry: 0,
            rz: 0
          },
          4: {
            rx: radToDeg(Math.PI / 2),
            ry: 0,
            rz: 0
          },
          5: {
            rx: 0,
            ry: 0,
            rz: radToDeg(Math.PI / 2)
          },
          6: {
            rx: radToDeg(Math.PI),
            ry: 0,
            rz: 0
          },
        };
        const diceElement = document.getElementById("dice");
    
        let newRoll = Math.floor(Math.random() * 6) + 1;
        while (newRoll === rollResult) {
          newRoll = Math.floor(Math.random() * 6) + 1;
        }
        rollResult = newRoll;
    
        const targetRotation = rollMap[rollResult];
        const startRotation = {
          rx: parseFloat(diceElement.getAttribute("rx")),
          ry: parseFloat(diceElement.getAttribute("ry")),
          rz: parseFloat(diceElement.getAttribute("rz")),
        };
    
        animate("rx", "easeOutCubic", targetRotation.rx, rollDuration);
        animate("ry", "easeOutCubic", targetRotation.ry, rollDuration);
        animate("rz", "easeOutCubic", targetRotation.rz, rollDuration);
        animate("y", "easeOutQuint", rollHeight, rollDuration * 0.35);
        setTimeout(() => {
          animate("y", "easeOutBounce", 1, rollDuration * 0.65);
        }, rollDuration * 0.35);
      }
    </script>

Interactive web page -> <https://mml.io/examples?example=Dice>[](https://mml.io/examples?example=Dice)

[PreviousA Basic Scene With Models And Cubes](/playground-documentation/resources/mml-examples/a-basic-scene-with-models-and-cubes)[NextA 3D Video Player](/playground-documentation/resources/mml-examples/a-3d-video-player)
