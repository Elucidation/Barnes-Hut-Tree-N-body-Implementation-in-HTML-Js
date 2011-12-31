Barnes-Hut N-body Simulation in HTML/Javascript
---

A [Barnes-Hut Simulation](http://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation) is an N-body simulation of gravitational interactions between point particles using the Barnes-Hut algorithm.

Usage
---
Open main file index.html with browser
Some screenshots are also in repo.

With Brute force : O(0.5*n^2) calculations, roughly 125k force calculations for N=500.
With Barnes-Hut tree calcualtions, it'll be O(nlogn).

Status
---
Basic framework set up, basic graviation working with forward euler and leapfrog integration.

Brute-force calculation O(n^2) for all bodies at the moment.

Next step, build quad-tree from bodies as in [LearnHTML5](https://github.com/Elucidation/LearnHTML5) repo.