# The mml editor tour | Playground Documentation | Somnia Docs

Copy

  1. [Beginner guides](/playground-documentation/beginner-guides)



# The mml editor tour

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FQRAkDUHa0nToG6Ls5BGx%2Fimage.png&width=768&dpr=4&quality=100&sign=a1ceb0b3&sv=2)

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2Fk1EIHWExBZNOUS0OCgEm%2Fimage.png&width=768&dpr=4&quality=100&sign=652cad8b&sv=2)

1 - [Elements Panel](/playground-documentation/beginner-guides/the-mml-editor-tour#elements-panel) \- Allows you to drag and drop MML elements into the scene

1.1 - [Assets Panel ](/playground-documentation/beginner-guides/the-mml-editor-tour#assets-panel)\- A tab next to the scene panel. This allows you to manage all the assets in you MML scene.

2 - [Hierarchy View ](/playground-documentation/beginner-guides/the-mml-editor-tour#hierarchy-view)\- A text representation of all the elements in the scene

3 - [Editor Window](/playground-documentation/beginner-guides/the-mml-editor-tour#editor-window) \- A window to edit the scene using 

4 - [Code Window ](/playground-documentation/beginner-guides/the-mml-editor-tour#code-window)\- A window to edit the scene via code and add logic to the scene

5 - [Debug Window](/playground-documentation/beginner-guides/the-mml-editor-tour#debug-window) \- A window that displays any debug information from the play scene

6 - [Play Window](/playground-documentation/beginner-guides/the-mml-editor-tour#play-window) \- A live view of your MML scene. This is what would be rendered in experience.

7 - [Element Inspector](/playground-documentation/beginner-guides/the-mml-editor-tour#element-inspector) \- A visual inspector to edit an MML elements

### 

Elements Panel

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FaozA4ZZCUC3YQMEPtoAz%2Fimage.png&width=768&dpr=4&quality=100&sign=74416618&sv=2)

With these panels, you can easily see all the MML elements you can add to the scene. For example, if we click the cube button, we will add a cube element to the scene.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FTdfQAMeMsU0Ed5JOcGgH%2Fimage.png&width=768&dpr=4&quality=100&sign=63c791a6&sv=2)

This is normally a good place to start when making something new

### 

Assets Panel

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2F73h5DZIZzTFB2CujhHQa%2Fimage.png&width=768&dpr=4&quality=100&sign=1661b107&sv=2)

The assets panel shows all the assets associated with your project. You can use this to manage the GLB files you will use for your MML scene. When you have uploaded an object, you can drag it into the scene. It will then be created as an m-model element.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FuX538PZrdS5VffxzTEXw%2Fimage.png&width=768&dpr=4&quality=100&sign=35189da&sv=2)

### 

Hierarchy View

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FZW1GYd4nDfCMLVbRjTnB%2Fimage.png&width=768&dpr=4&quality=100&sign=5552be5&sv=2)

The hierarchy view shows all the elements in your MML scene. You can use this to select objects and create sub hierarchies. When an element is a sub-element of another, it will move in relation to it. This is similar to a game engine such and Unity or Unreal. For example I have added a cube to the scene and dragged it to be a sub item of the model in the scene. Now when I move the model the cube will also move.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FJDcZV3mmlX1WDy0dMi8K%2Fimage.png&width=768&dpr=4&quality=100&sign=fa1c6b7d&sv=2)

This is reflected in the code window, with the cube nested in the m-model element, similar to how you would see it in a HTML webpage.

This concept is useful for creating hierarchies of things that should be associated and moving around the scene together.

### 

Editor Window

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FJDjjwMnw5rzawGegUIzk%2Fimage.png&width=768&dpr=4&quality=100&sign=393c84e7&sv=2)

The editor window is where you can visualize and edit with your scene. You can select the elements in the scene to edit their properties with the [element inspector](/playground-documentation/beginner-guides/the-mml-editor-tour#element-inspector). You can also move objects around the scene; if you select them, you will see gadgets to move the elements. These work similar to game engines or 3d editor tools.

### 

Code Window

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2F2XH95IriwnK7NHcWynzP%2Fimage.png&width=768&dpr=4&quality=100&sign=190acf77&sv=2)

The code window allows you to edit the scene through code. The language we use is MML which is very similar to HTML using tags and javascript. 

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FY5SRrmesUIs9aaR0lb84%2Fimage.png&width=768&dpr=4&quality=100&sign=afa16c95&sv=2)

Here we have added a small amount of javascript to rotate the cube when we click it. You can learn more about using MML in [this guide](/playground-documentation/beginner-guides/using-the-mml-editor-and-creating-your-first-dynamic-object) or by looking at the [MML resources](/playground-documentation/resources/mml-reference-docs) or going to the [MML website](https://mml.io/).

### 

Debug Window

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FQWTbtcibXmNyWDbqI38n%2Fimage.png&width=768&dpr=4&quality=100&sign=52f2b9fd&sv=2)

The debug window will displays any errors or console output linked to your scene. This is used for debugging a scene through console prints and errors. You use this as you would a normal web browser console (eg using console.log()).

For example the code above we have added a console.log statement when we click the cube.

Copy
    
    
    <m-model src="https://mmlstorage.com/c448d8059fbd074c31de266a4432c3e9a1acb95d6f3ba4d8662ec81606020172" x="1" y="2">
      <m-cube id="cube" y="3" onclick="spinCube()" color="#d80e0e"></m-cube>
    
    </m-model>
    
    <script>
      let counter = 1;
      // Let's make the cube spin
      function spinCube() {
        // Gets the cube object based it's id
        console.log("you clicked the cube")
        const cube = document.getElementById("cube");
        // Sets the  cube objects ry value (changes it's rotation). This will spin it by 36 degrees each time we click it
        cube.setAttribute("ry", (counter / 10 * 360) % 360);
        counter = counter + 1
      }
    </script>

We can then click the cube in the [play window](/playground-documentation/beginner-guides/the-mml-editor-tour#play-window). Which will output it to the console:

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FJTeygz9h94OZFFJ1LAjv%2Fimage.png&width=768&dpr=4&quality=100&sign=41848cbd&sv=2)

### 

Play Window

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2F5ajS80qdkZtR1Nd9GfR2%2Fimage.png&width=768&dpr=4&quality=100&sign=5589d2f9&sv=2)

The play window renders your scene as a client would see it. This means that if it were viewed in a web browser or in an experience, this is what it would look like. You can also test interactions by clicking on elements in this scene. This view has a floating camera, which you can move with WASD and rotate by left-clicking the mouse.

### 

Element Inspector

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FP6Bmttn9l9rmK9OS320o%2Fimage.png&width=768&dpr=4&quality=100&sign=30ff84d5&sv=2)

Once you have selected an element in the [editor window](/playground-documentation/beginner-guides/the-mml-editor-tour#editor-window), you can modify its properties with the inspector. This shows all the properties of the MML elements in a visual way. It's very useful if you don't remember a specific code tag or want to edit the scene in a more visual way.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FlFksZE2CPS7VKkmHeuWB%2Fimage.png&width=768&dpr=4&quality=100&sign=324e3f45&sv=2)

Here we have edited the color of the cube by clicking the color element and selecting the red color. There are many tags which can be seen in the [MML Reference Docs](/playground-documentation/resources/mml-reference-docs).

[PreviousUsing the mml editor and creating your first dynamic object](/playground-documentation/beginner-guides/using-the-mml-editor-and-creating-your-first-dynamic-object)[NextAvatar Builder](/playground-documentation/components/avatar-builder)
