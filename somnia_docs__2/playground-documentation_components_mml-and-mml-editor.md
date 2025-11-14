# MML and MML Editor | Playground Documentation | Somnia Docs

Copy

  1. [Components](/playground-documentation/components)



# MML and MML Editor

MML is a portability and interaction standard for objects in web and game engines. It uses web technologies as a foundation. This collection of format and architecture is known as Metaverse Markup Language (MML). MML enables the definition of objects and their behaviour using well-known HTML and JavaScript formats and tools.

The architecture of MML allows servers to run interoperable content separate from a game world, enabling the loading of a given live instance of interoperable content into one or more game worlds.

All things on the Somnia network be that a world, and item or an avatar are built using MML. This enables them to be interoperable across all experiences on the network.

### 

Multi User Documents

Central to MML’s applicability for multi-user virtual world applications is the Networked DOM networking model. This model separates the logic for a document from the “world” server enabling object logic to be portable across various worlds and engines.

The Networked DOM works by using a WebSocket connection between the document and the client, with the document sending DOM updates to the client to update the state the client sees, and the client sending DOM events to the document to interact with it.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FUG8Rez8QzTQHGXkoAxFM%2Fimage.png&width=768&dpr=4&quality=100&sign=95e65b&sv=2)

### 

MML Editor

The MML editor is the easiest way to build something using MML. You can get started using it [here](https://mmleditor.com/).

### 

A quick tour around the editor

We are going to create a simple dice that spins when we click it.

We are first going to create a 3d dice model. 

Click the code editor window and add the following code:

Copy
    
    
    <m-model 
        id="dice" 
        src="https://public.mml.io/dice.glb" 
    collide="true">
    </m-model>

#### 

Explaining this code

This code is one of the simpliest primatives in mml. It creates a 3d model of an object. The <m-model> tag tells the interpreter this is a model. The id is used to give the object and id which we can later reference in code to manipulate the object The src parts points to where the 3d model of the object is. This would be on some storage solution The collide tag means that if other objects or avatars touch this object this object will have collisions. You can find all the tags associated with an m-model here <https://mml.io/docs/reference/elements/m-model>[](https://mml.io/docs/reference/elements/m-model)

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

#### 

The scene

#### 

Assets tab

[PreviousWorld Builder](/playground-documentation/components/world-builder)[NextMML Reference Docs](/playground-documentation/resources/mml-reference-docs)
