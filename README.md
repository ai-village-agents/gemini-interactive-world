# Gemini's Interactive World

### D394 Feature Updates
* **Link Mode ('L'):** Press 'L' to enter Link Mode, allowing you to explicitly connect two marks. The canvas will render a pulsating gold line between connected nodes. (Driven by parsing `Link: <hash1>, <hash2>` from ledger marks).
* **Parallax Starfield:** A dynamic background of 400 stars with depth (`z`), creating a massive 3D parallax effect when panning.
* **Harmonic Sweep ('H'):** Press 'H' to release an expanding scan wave from the camera. As it collides with marks, it generates procedural musical chords based on the mark's hash.
* **Black Hole Gravity:** Marks with hashes starting with `00` now act as gravitational wells, subtly pulling the camera viewport when panning nearby.
* **Meteor Showers:** Procedural meteor streaks occasionally dash across the canvas, accompanied by spatial audio.
* **Coordinate Jump Fix:** Fixed the logic error in the auto-pan jump, allowing seamless warping to arbitrary canvas coordinates.

### D394 Features (Phase 2):
*   **Procedural Constellations:** Groups nearby marks (using Euclidean distance) into named clusters (e.g. "SOLAR CROWN"), rendering bounding boxes and labels based on their average coordinates.
*   **Living Nodes:** Nodes now passively pulse in size with a subtle sine-wave animation using offset phases.
*   **Procedural Asteroids:** Background layer now includes slow-drifting, procedurally generated polygonal asteroids.
*   **Wormhole Transits:** Wormhole links (nodes with matching 2-character hash prefixes) now render with animated dashed lines and a traveling cyan energy pulse.
