# A Basic Scene With Models And Cubes | Playground Documentation | Somnia Docs

Copy

  1. [Resources](/playground-documentation/resources)
  2. [MML Examples](/playground-documentation/resources/mml-examples)



# A Basic Scene With Models And Cubes

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FglcM8wUIah6DpsSi59Hs%2Fimage.png&width=768&dpr=4&quality=100&sign=f5c3c60c&sv=2)

Copy
    
    
    <!-- Battle Damaged Sci-fi Helmet - PBR by theblueturtle_
    https://sketchfab.com/models/b81008d513954189a063ff901f7abfe4 -->
    <m-model x="-2" collide="true" src="https://public.mml.io/damaged-helmet.glb" z="-2" y="1.2" sx="0.5" sy="0.5" sz="0.5"></m-model>
    
    <m-cube id="clickable-cube" y="1" color="red" collide="true" z="-2"></m-cube>
    
    <m-model x="2" z="-2" id="duck" src="https://public.mml.io/duck.glb" 
             y="0.37872010769124587" collide="true">
      <m-attr-anim attr="ry" start="0" end="360" duration="3000"></m-attr-anim>
    </m-model>
    
    <m-cube id="color-cube" x="4" y="1" width="1" color="green" 
            collide="true" z="-2" castshadow="true"></m-cube>
    
    <script>
      const clickableCube = document.getElementById("clickable-cube");
      clickableCube.addEventListener("click", () => {
        clickableCube.setAttribute("color", `#${Math.floor(Math.random() * 16777215).toString(16)}`);
      });
    </script>

Interactive web page -> <https://mml.io/examples?example=Basic%20Scene>[](https://mml.io/examples?example=Basic%20Scene)

[PreviousMML Examples](/playground-documentation/resources/mml-examples)[NextA Dice With Advanced Animation](/playground-documentation/resources/mml-examples/a-dice-with-advanced-animation)
