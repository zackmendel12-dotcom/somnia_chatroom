# Using the mml editor and creating your first dynamic object | Playground Documentation | Somnia Docs

Copy

  1. [Beginner guides](/playground-documentation/beginner-guides)



# Using the mml editor and creating your first dynamic object

We will create a simple dice that spins when we click it.

We are first going to create a 3d dice model. 

First create a new project. Head over to <https://mmleditor.com/>[](https://mmleditor.com/) and click the create project button:

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2F7wh5pRkMQHcdwket8hjd%2Fimage.png&width=768&dpr=4&quality=100&sign=67d4b333&sv=2)

If you want to learn about the different parts of the mml editor you can go to this guide. If you just want to create the object click the code editor window and add the following code:

Copy
    
    
    <m-model 
        id="dice" 
        src="https://public.mml.io/dice.glb" 
    collide="true">
    </m-model>

#### 

Explaining this code

This code is one of the simplest primitives in MML. It creates a 3d model of an object. The <m-model> tag tells the interpreter this is a model. The id is used to give the object and id, which we can later reference in code to manipulate the object. The src parts point to where the 3d model of the object is. This would be on some storage solution. The collide tag means that if other objects or avatars touch this object, it will have collisions. You can find all the tags associated with an m-model here <https://mml.io/docs/reference/elements/m-model>[](https://mml.io/docs/reference/elements/m-model)

Your editor should now look like this: 

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2F7BgeWiOPNRrC4WdFoo5U%2Fimage.png&width=768&dpr=4&quality=100&sign=104f3615&sv=2)

You can now do some simple things in the editor. Let's try moving the dice around. To do this click on the dice in the edit window. This should look like this: 

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FvmwLPycoPLdUTaDtNwJ6%2Fimage.png&width=768&dpr=4&quality=100&sign=7e0da21b&sv=2)

You can now move the dice around the scene by left-clicking and dragging the arrows. The green arrow will move up and down, the red arrows left and right, and the blue arrow forward and backward. Let's move the dice so it's above the ground.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FN35PZB3nJSbXk4WcQdek%2Fimage.png&width=768&dpr=4&quality=100&sign=a1558e75&sv=2)

You will see the dice move in real-time in the play editor and also the code updating the x, y and z values:

Copy
    
    
    <m-model id="dice" 
             src="https://public.mml.io/dice.glb" 
             collide="true" y="5.348" x="3.404">
    </m-model>

Ok we are now going to add some code to make the dice spin when we click it. First add the following javascript. We have annotated it with comments to explain how it works: 

Copy
    
    
    <script>
      let counter = 1;
      // Let's make the dice spin
      function spinDice() {
        // Gets the dice object based it's id
        const dice = document.getElementById("dice");
        // Sets the  dice objects ry value (changes it's rotation). This will spin it by 36 degrees each time we click it
        dice.setAttribute("ry", (counter / 10 * 360) % 360);
        counter = counter + 1
      }
    </script>

We now need to add the onclick event to the dice. this will call the code we wrote above when we click the dice:

Copy
    
    
    <m-model id="dice" 
             src="https://public.mml.io/dice.glb" 
             collide="true" y="5.348" x="3.404" 
             onclick="spinDice()"></m-model>

It should look like the window below if you have everything in the right place: 

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FEsnf5XNQ6sL29z38ST2Q%2Fimage.png&width=768&dpr=4&quality=100&sign=9317c35e&sv=2)

Now if you click the dice in the play window you will see it Spin! Congratz you just made your first dynamic mml object. Now try uploading it using the item builder and using it in the playground!

[PreviousCreating a custom world](/playground-documentation/getting-started/creating-a-custom-world)[NextThe mml editor tour](/playground-documentation/beginner-guides/the-mml-editor-tour)
