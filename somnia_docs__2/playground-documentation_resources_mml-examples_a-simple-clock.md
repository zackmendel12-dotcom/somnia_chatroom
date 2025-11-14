# A Simple Clock | Playground Documentation | Somnia Docs

Copy

  1. [Resources](/playground-documentation/resources)
  2. [MML Examples](/playground-documentation/resources/mml-examples)



# A Simple Clock

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FyPIkMaYUR6rUOTopC3qQ%2Fimage.png&width=768&dpr=4&quality=100&sign=230c8447&sv=2)

Copy
    
    
    <m-group y="4">
      <m-cylinder color="lightgrey" radius="4" height="0.1" rx="90"></m-cylinder>
      <m-group id="hour" rz="0" z="0.1">
        <m-cube sx="0.14" sy="1.2" sz="0.08" z="0.04" color="#000000" y="0.2"></m-cube>
      </m-group>
      <m-group id="minute" rz="0" z="0.11">
        <m-cube sx="0.1" sy="2.4" sz="0.08" z="0.04" color="#000000" y="0.3"></m-cube>
      </m-group>
      <m-group id="second" rz="0" z="0.12">
        <m-cube sx="0.08" sy="3.2" sz="0.08" z="0.04" color="#ff0000" y="0.8"></m-cube>
      </m-group>
    </m-group>
    
    <script>
      function setTime() {
        const d = new Date();
        document.getElementById("hour").setAttribute("rz", (d.getHours() / 12) * -360);
        document.getElementById("minute").setAttribute("rz", (d.getMinutes() / 60) * -360);
        document.getElementById("second").setAttribute("rz", (d.getSeconds() / 60) * -360);
      }
    
      setTime();
    
      setInterval(setTime, 1000); // update every second
    </script>

[PreviousInteraction With A Weather API](/playground-documentation/resources/mml-examples/interaction-with-a-weather-api)[NextTic Tac Toe Game](/playground-documentation/resources/mml-examples/tic-tac-toe-game)
