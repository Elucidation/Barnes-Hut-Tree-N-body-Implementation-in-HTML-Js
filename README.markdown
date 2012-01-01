Barnes-Hut N-body Simulation in HTML/Javascript
---

A [Barnes-Hut Simulation](http://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation) is an N-body simulation of gravitational interactions between point particles using the Barnes-Hut algorithm.

Usage
---
Open main file index.html with browser
Some screenshots are also in repo.

With Brute force : `O(n^2)` calculations (exactly `(N-1)*N/2` actually), roughly 125k force calculations for N=500.
With Barnes-Hut tree calcualtions, it'll be `O(nlogn)`.

With a low number of bodies N < 50 or so, a slightly streamlined brute force is more efficient than a Barnes-Hut tree, but
as N increases, the efficiency increases dramatically (90-99%).

Status
---
Basic framework set up, basic graviation working with forward euler and leapfrog integration.

Brute-force calculation `O(n^2)` for all bodies. Real-time for roughly N < 500
Barnes-Hut calculation implemented and working. Real-time for N > 1k etc.

Efficiency information is shown in real-time to the right of the canvas.

Example with 1,000 bodies.
``
# Bodies: 1000
# Force calculations per step: 32457
BN TREE - Depth: 11, # Nodes: 1544, # Leafs: 891
BN Tree O(nlogn) [32457]
Efficiency vs Brute Force O(n^2) [1000000] 96.75%
Efficiency vs Half Brute Force O(n^2) [499500] 93.50%
``


Next step, build quad-tree from bodies as in [LearnHTML5](https://github.com/Elucidation/LearnHTML5) repo.