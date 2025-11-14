# MML Reference Docs | Playground Documentation | Somnia Docs

Copy

  1. [Resources](/playground-documentation/resources)



# MML Reference Docs

This page has the reference documentation for MML. This can also be found on the mml website https://mml.io/docs/reference

### 

Elements

All of the MML Elements with available attributes and examples.

  * [`<m-group>`](https://mml.io/docs/reference/elements/m-group)

The `m-group` element can contain other MML tags, allowing all of them to be transformed as single item.

  * [`<m-cube>`](https://mml.io/docs/reference/elements/m-cube)

The `m-cube` element is a primitive 3D cube that can be coloured. It is often used for debugging or initial development purposes.

  * [`<m-sphere>`](https://mml.io/docs/reference/elements/m-sphere)

The `m-sphere` element is a primitive 3D sphere that can be coloured. It is often used for debugging or initial development purposes.

  * [`<m-cylinder>`](https://mml.io/docs/reference/elements/m-cylinder)

The `m-cylinder` element is a primitive 3D cylinder that can be coloured. It is often used for debugging or initial development purposes.

  * [`<m-light>`](https://mml.io/docs/reference/elements/m-light)

The `m-light` element is a light that supports various types (e.g. `point`, `spotlight`) and can be coloured.

  * [`<m-plane>`](https://mml.io/docs/reference/elements/m-plane)

The `m-plane` element is a primitive 3D plane that can be coloured.

  * [`<m-model>`](https://mml.io/docs/reference/elements/m-model)

The `m-model` element is a 3D model. It can be used to load and display various 3D model file formats, such as OBJ, FBX, or GLTF, depending on the rendering engine being used. The model can be positioned, rotated, and scaled within the 3D scene. It also supports animations.

  * [`<m-character>`](https://mml.io/docs/reference/elements/m-character)

The `m-character` element is a 3D character. It supports containing other `m-model` elements, allowing for composing a character from multiple models.

  * [`<m-frame>`](https://mml.io/docs/reference/elements/m-frame)

The `m-frame` element is a 3D frame. It enables composing other MML documents into the document and transforming them as a unit.

  * [`<m-audio>`](https://mml.io/docs/reference/elements/m-audio)

The `m-audio` element is used to play audio in a 3D scene.

  * [`<m-image>`](https://mml.io/docs/reference/elements/m-image)

The `m-image` element is used to display an image in a 3D scene.

  * [`<m-video>`](https://mml.io/docs/reference/elements/m-video)

The `m-video` element is used to display a video in a 3D scene.

  * [`<m-label>`](https://mml.io/docs/reference/elements/m-label)

The `m-label` element is used to display text on a plane in a 3D scene.

  * [`<m-position-probe>`](https://mml.io/docs/reference/elements/m-position-probe)

The `m-position-probe` element is used to request the position of a user (either camera or avatar depending upon the experience).

  * [`<m-prompt>`](https://mml.io/docs/reference/elements/m-prompt)

The `m-prompt` element is used to request a string from the user when the element is clicked in a 3D scene.

  * [`<m-interaction>`](https://mml.io/docs/reference/elements/m-interaction)

The `m-interaction` element is used to describe an action that a user can take at a point in 3D space.

  * [`<m-chat-probe>`](https://mml.io/docs/reference/elements/m-chat-probe)

The `m-chat-probe` element is used to receive messages from a chat system. Which chat system that is depends on the client implementation.

  * [`<m-attr-anim>`](https://mml.io/docs/reference/elements/m-attr-anim)

The `m-attr-anim` element is used to describe document time-synchronized changes to element attributes.




### 

Events

All of the MML Event types and their properties.

  * [`ConnectionEvent`](https://mml.io/docs/reference/events/ConnectionEvent)

A class that extends Event | `Event`.

  * [`MMLChatEvent`](https://mml.io/docs/reference/events/MMLChatEvent)

A class that extends Event | `Event`.

  * [`MMLClickEvent`](https://mml.io/docs/reference/events/MMLClickEvent)

Received when a user clicks on a 3D object.

  * [`MMLCollisionEndEvent`](https://mml.io/docs/reference/events/MMLCollisionEndEvent)

Received when a user stops colliding with an element.

  * [`MMLCollisionMoveEvent`](https://mml.io/docs/reference/events/MMLCollisionMoveEvent)

Received when a user moves the collision point they are colliding at on an element.

  * [`MMLCollisionStartEvent`](https://mml.io/docs/reference/events/MMLCollisionStartEvent)

Received when a user starts colliding with an element.

  * [`MMLInteractionEvent`](https://mml.io/docs/reference/events/MMLInteractionEvent)

Received when a user interacts with an m-interaction.

  * [`MMLPositionEnterEvent`](https://mml.io/docs/reference/events/MMLPositionEnterEvent)

Received when a user enters the range of an m-position-probe.

  * [`MMLPositionLeaveEvent`](https://mml.io/docs/reference/events/MMLPositionLeaveEvent)

Received when a user leaves the range of an m-position-probe after having entered.

  * [`MMLPositionMoveEvent`](https://mml.io/docs/reference/events/MMLPositionMoveEvent)

Received when a user moves after having entered the range of an m-position-probe.

  * [`MMLPromptEvent`](https://mml.io/docs/reference/events/MMLPromptEvent)

Received when a user triggers a prompt with a value.

  * [`RemoteEvent`](https://mml.io/docs/reference/events/RemoteEvent)

A class that extends Event | `Event`.




You can go to the mml website to learn more about these comonents -> <https://mml.io/docs/reference/elements/m-group>[](https://mml.io/docs/reference/elements/m-group)

[PreviousMML and MML Editor](/playground-documentation/components/mml-and-mml-editor)[NextMML Examples](/playground-documentation/resources/mml-examples)
