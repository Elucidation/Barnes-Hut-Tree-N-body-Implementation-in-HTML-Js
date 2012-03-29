Barnes-Hut N-body Simulation in HTML/Javascript
---

A [Barnes-Hut Simulation](http://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation) is an N-body simulation of gravitational interactions between point particles using the Barnes-Hut algorithm.

[Try it out](http://www.prism.gatech.edu/~gth716h/BNtree/)

This simulator shows for an arbitrary amount of bodies/points in a 2d field:

![Clear image 1k bodies](http://i.imgur.com/tygCK.png)

A Barnes-Hut Tree sub-divides the space by quadrants:

![BN Tree image 1k bodies](http://i.imgur.com/f7OI0.png)


Usage
---
Open main file index.html with browser
Some screenshots are also in repo.

With Brute force : `O(n^2)` calculations (exactly `(N-1)*N/2` actually), roughly 125k force calculations for N=500.
With Barnes-Hut tree calcualtions, it'll be `O(nlogn)`.

With a low number of bodies N < 50 or so, a slightly streamlined brute force is more efficient than a Barnes-Hut tree, but
as N increases, the efficiency increases dramatically:
With Theta = 0.5, roughly 50% gain for N < 500, 80% for N < 1000, reaching up to 90% beyond.

With 10k bodies it takes around 0.5~0.8 seconds to compute a step, and 0.1-0.3 seconds to display it on the canvas.


How `index.html` looks:

![Live demo screenshot](http://i.imgur.com/W0jO4.png)

Debug using the console (older image):

![How index.html looks in a browswer](http://i.imgur.com/NJEvM.png)

Status
---
Basic framework set up, basic graviation working with forward euler and leapfrog integration.

Brute-force calculation `O(n^2)` for all bodies. Real-time for roughly N < 500
Barnes-Hut calculation implemented and working. Real-time for N > 1k etc.

Efficiency information is shown in real-time to the right of the canvas.


Following examples testing with Theta=1 (not accurate)
Example with 1,000 bodies.

```
# Bodies: 1000
# Force calculations per step: 32457
BN TREE - Depth: 11, # Nodes: 1544, # Leafs: 891
BN Tree O(nlogn) [32457]
Efficiency vs Brute Force O(n^2) [1000000] 96.75%
Efficiency vs Half Brute Force O(n^2) [499500] 93.50%
```

With 5,000 Bodies

```
Bodies: 5000
Force calculations per step: 623195
BN Tree Depth: 13
Nodes: 8681
Leafs: 4979
Number of Calculations
BN Tree: 623195
Brute Force: 12497500
Speedup : 95.01%
Time per step
Compute : 752ms
Display : 636ms
```

With 10,005 Bodies

```
# Bodies: 10005
# Force calculations per step: 383004
BN TREE - Depth: 13, # Nodes: 17368, # Leafs: 10005
BN Tree O(nlogn) [383004]
Efficiency vs Brute Force O(n^2) [100100025] 99.62%
Efficiency vs Half Brute Force O(n^2) [50045010] 99.23%
Time to compute step : 615ms
Time to display step : 156ms
```
---

Copyright (c) 2012, Sameer Ansari - elucidation@gmail.com
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met: 

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer. 
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those
of the authors and should not be interpreted as representing official policies, 
either expressed or implied, of the FreeBSD Project.