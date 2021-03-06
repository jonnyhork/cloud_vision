# Turing's Crystal Ball

### This is my Q1 project for Galvanize
#### Drag and drop and image to get your psychic reading...



*The Turing Test states that if a machine's ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human, then it passes.*

To look into Turing's Crystal Ball, drag and drop an image less than 4mb into the center of the crystal. Wait a moment to your fortune to be generated, then you can decide if there is a psychic or a machine at the other end. You can add to the experience with the Stranger Things theme song by clicking the musical note in the upper left hand corner.

For this project I used *Google Cloud Vision API* for image label analysis and then *Google Natural Language API* for *sentiment evaluation* of the image labels (seen in light blue above your fortune). I wanted to explore the limitations of the current state of *AI and machine learning*.

While my application of this technology is rather limited, I was surprised at the simplicity of the response from the API. Most of the image labels returned are generally vague nouns. Further more the API at trouble producing at least 10 labels for some types of photos.

*If the labels (in dark purple come back) read as undefined that means the API did not recognize anything else in the image. I capped the response to a max of 10 image labels.*
